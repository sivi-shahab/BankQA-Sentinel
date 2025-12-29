
import { GoogleGenAI, Type } from "@google/genai";
import { CallAnalysis, PiiSettings, DictionaryItem, FullDashboardContext } from "../types";
import { logLLMTelemetry, startTrace, endTrace, estimateTokens } from "./datadogService";

// In-memory cache for avatars to prevent rate limiting (429)
const avatarCache: Record<string, string> = {};

// Helper: Exponential Backoff Retry
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded');
      
      // If it's a rate limit error
      if (isRateLimit) {
        if (i < maxRetries - 1) {
          console.warn(`Gemini API Rate Limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        } else {
           // If we are out of retries and it's a rate limit, rethrow specific error to be handled by caller
           throw new Error("RATE_LIMIT_EXCEEDED");
        }
      }
      
      throw error;
    }
  }
  throw new Error("Operation failed after max retries");
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    transcriptSegments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          text: { type: Type.STRING },
          timestamp: { type: Type.STRING }
        },
        required: ["speaker", "text", "timestamp"]
      }
    },
    summary: { type: Type.STRING },
    qualityScore: { type: Type.INTEGER },
    sentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
    sentimentReasoning: { type: Type.STRING },
    nextBestActions: { type: Type.ARRAY, items: { type: Type.STRING } },
    complianceChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["PASS", "FAIL", "WARNING"] },
          details: { type: Type.STRING }
        },
        required: ["category", "status", "details"]
      }
    },
    glossaryUsed: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
          contextInCall: { type: Type.STRING }
        },
        required: ["term", "definition", "contextInCall"]
      }
    },
    extractedInfo: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING },
        customerName: { type: Type.STRING },
        dateOfBirth: { type: Type.STRING },
        identityNumber: { type: Type.STRING },
        motherMaidenName: { type: Type.STRING },
        bankAccountNumber: { type: Type.STRING },
        targetBankName: { type: Type.STRING },
        contributionAmount: { type: Type.STRING },
        phoneNumber: { type: Type.STRING },
        emailAddress: { type: Type.STRING },
        occupation: { type: Type.STRING },
        residentialAddress: { type: Type.STRING },
        customerAgreed: { type: Type.BOOLEAN },
        loanAmount: { type: Type.STRING },
        monthlyInstallment: { type: Type.STRING },
        installmentDuration: { type: Type.STRING },
        adminFee: { type: Type.STRING },
        interestRate: { type: Type.STRING },
        crossSellProduct: { type: Type.STRING }
      },
      required: [
        "productName", "customerName", "dateOfBirth", "identityNumber", 
        "motherMaidenName", "bankAccountNumber", "targetBankName", 
        "contributionAmount", "phoneNumber", "emailAddress", "occupation", 
        "residentialAddress", "customerAgreed", "loanAmount", "monthlyInstallment",
        "installmentDuration", "adminFee", "interestRate", "crossSellProduct"
      ]
    },
    conversationStats: {
      type: Type.OBJECT,
      properties: {
        agentTalkTimePct: { type: Type.NUMBER },
        customerTalkTimePct: { type: Type.NUMBER },
        wordsPerMinute: { type: Type.NUMBER },
        interruptionCount: { type: Type.NUMBER },
        effectivenessRating: { type: Type.STRING, enum: ['OPTIMAL', 'AGENT_DOMINATED', 'CUSTOMER_DOMINATED'] },
        feedback: { type: Type.STRING }
      },
      required: ["agentTalkTimePct", "customerTalkTimePct", "wordsPerMinute", "interruptionCount", "effectivenessRating", "feedback"]
    },
    agentPerformance: {
      type: Type.OBJECT,
      properties: {
        empathyScore: { type: Type.NUMBER },
        clarityScore: { type: Type.NUMBER },
        persuasionScore: { type: Type.NUMBER },
        productKnowledgeScore: { type: Type.NUMBER },
        closingSkillScore: { type: Type.NUMBER },
        verdict: { type: Type.STRING, enum: ['STAR_PERFORMER', 'SOLID_PERFORMER', 'AVERAGE', 'NEEDS_COACHING'] },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["empathyScore", "clarityScore", "persuasionScore", "productKnowledgeScore", "closingSkillScore", "verdict", "strengths", "weaknesses"]
    },
    genderProfile: {
      type: Type.OBJECT,
      properties: {
        agentGender: { type: Type.STRING, enum: ["MALE", "FEMALE", "UNKNOWN"] },
        customerGender: { type: Type.STRING, enum: ["MALE", "FEMALE", "UNKNOWN"] },
        reasoning: { type: Type.STRING }
      },
      required: ["agentGender", "customerGender", "reasoning"]
    }
  },
  required: ["transcriptSegments", "summary", "qualityScore", "sentiment", "sentimentReasoning", "nextBestActions", "complianceChecklist", "glossaryUsed", "extractedInfo", "conversationStats", "agentPerformance", "genderProfile"]
};

export const analyzeTelemarketingAudio = async (
  base64Audio: string, 
  piiSettings: PiiSettings, 
  referenceText: string = '', 
  dictionary: DictionaryItem[] = [],
  audioMimeType: string = 'audio/webm'
): Promise<CallAnalysis> => {
  const startTime = startTrace();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';

  const performAnalysis = async () => {
    // Construct PII Redaction Instructions based on settings
    const piiInstructions = Object.entries(piiSettings)
      .filter(([key, value]) => value === true)
      .map(([key]) => {
        switch(key) {
          case 'redactEmail': return '- Redact Email Addresses (replace with [EMAIL_REDACTED])';
          case 'redactNIK': return '- Mask NIK/ID Numbers (replace with [ID_REDACTED])';
          case 'redactMotherName': return '- Redact Mother\'s Maiden Name (replace with [MOTHER_REDACTED])';
          case 'redactCustomerName': return '- Redact Customer Name (replace with [NAME_REDACTED])';
          case 'redactPhone': return '- Redact Phone Numbers (replace with [PHONE_REDACTED])';
          case 'redactDOB': return '- Redact Date of Birth (replace with [DOB_REDACTED])';
          case 'redactAddress': return '- Redact Residential Addresses (replace with [ADDRESS_REDACTED])';
          default: return '';
        }
      })
      .filter(s => s !== '')
      .join('\n');

    let systemPrompt = `You are a Senior Quality Control Auditor for a major bank. Analyze this telemarketing call recording.
    1. Transcribe accurately with speaker labels (Agent vs Customer).
    2. Evaluation Metrics:
       - Calculate exact Talk Time percentages for both speakers.
       - Calculate Words Per Minute (WPM) based on transcript length and duration.
       - Count interruptions (overlapping speech).
    3. Performance Audit:
       - List specific Strengths (what they did well).
       - List specific Weaknesses/Improvement Areas (missed scripts, compliance errors, tone issues).
    4. Compliance: Map against OJK & BI regulations.
    5. CRM Data Extraction: Parse all loan/product details precisely.
    
    *** PRIVACY & REDACTION RULES ***
    You MUST apply the following redaction rules to the transcript and extracted info:
    ${piiInstructions || 'No redaction required.'}

    If the setting is enabled, ensure the extraction output contains the redacted placeholder, not the original value.
    `;

    if (referenceText) {
      systemPrompt += `\n\n*** REFERENCE DOCUMENT ***\nUse this context for compliance verification:\n${referenceText}`;
    }

    if (dictionary.length > 0) {
      systemPrompt += `\n\n*** CUSTOM DICTIONARY ***\nIdentify these specific terms:\n`;
      dictionary.forEach(item => {
        systemPrompt += `- ${item.term}: ${item.definition}\n`;
      });
    }

    try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              { inlineData: { mimeType: audioMimeType, data: base64Audio } },
              { text: systemPrompt }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.1,
          }
        });

        if (!response.text) throw new Error("No response generated");
        const parsedResult = JSON.parse(response.text.trim()) as CallAnalysis;

        // DATADOG TELEMETRY: SUCCESS
        logLLMTelemetry({
            model: modelName,
            operation: 'audio_analysis',
            durationMs: endTrace(startTime),
            status: 'success',
            tokensInputEstimate: estimateTokens(systemPrompt) + 2000, // + audio buffer estimate
            tokensOutputEstimate: estimateTokens(response.text),
            qualityScore: parsedResult.qualityScore,
            sentiment: parsedResult.sentiment,
            compliancePassRate: (parsedResult.complianceChecklist.filter(c => c.status === 'PASS').length / parsedResult.complianceChecklist.length) * 100
        });

        return parsedResult;

    } catch (error: any) {
        // DATADOG TELEMETRY: ERROR
        logLLMTelemetry({
            model: modelName,
            operation: 'audio_analysis',
            durationMs: endTrace(startTime),
            status: 'error',
            errorType: error.message || 'Unknown Gemini Error',
            tokensInputEstimate: estimateTokens(systemPrompt),
            tokensOutputEstimate: 0
        });
        throw error;
    }
  };

  // Use retry logic
  return retryOperation(performAnalysis);
};

export const sendChatQuery = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string,
  dashboardContext: FullDashboardContext,
  referenceText: string = ''
): Promise<string> => {
  const startTime = startTrace();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';
  
  const performChat = async () => {
    try {
        const systemInstruction = `You are the ProofPoint.AI FinAI Intelligence Assistant.
        You have absolute access to all data on the dashboard for deep context analysis.
        `;

        const chat = ai.chats.create({
          model: modelName,
          config: { systemInstruction },
          history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
        });

        const result = await chat.sendMessage({ message: currentMessage });
        const text = result.text || "No response.";

        // DATADOG TELEMETRY
        logLLMTelemetry({
            model: modelName,
            operation: 'chat_query',
            durationMs: endTrace(startTime),
            status: 'success',
            tokensInputEstimate: estimateTokens(currentMessage) + estimateTokens(JSON.stringify(history)),
            tokensOutputEstimate: estimateTokens(text)
        });

        return text;
    } catch (error: any) {
        logLLMTelemetry({
            model: modelName,
            operation: 'chat_query',
            durationMs: endTrace(startTime),
            status: 'error',
            errorType: error.message,
            tokensInputEstimate: estimateTokens(currentMessage),
            tokensOutputEstimate: 0
        });
        throw error;
    }
  };

  return retryOperation(performChat);
};

// Helper to generate deterministic colors based on name string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Fallback SVG Generator that runs locally
const generateFallbackAvatar = (name: string, skill: string) => {
  const color = stringToColor(name);
  const initial = name.charAt(0).toUpperCase();
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${initial}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#grad-${initial})" rx="20" />
    <circle cx="50" cy="50" r="30" fill="white" fill-opacity="0.2" />
    <text x="50" y="55" font-family="Inter, sans-serif" font-size="40" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">${initial}</text>
    <text x="50" y="85" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="white" text-anchor="middle" opacity="0.9" letter-spacing="1">${skill.toUpperCase().split(' ')[0]}</text>
  </svg>`;
};

export const generateAgentAvatar = async (name: string, skill: string): Promise<string> => {
  const cacheKey = `${name}:${skill}`;
  if (avatarCache[cacheKey]) {
    return avatarCache[cacheKey];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  const generate = async () => {
    const prompt = `Generate a modern, abstract, geometric SVG icon code for a user avatar.
    Name: ${name} (Use this for creative seed, do not put text in image).
    Top Skill: ${skill}.
    
    Style Directions:
    - Use specific shapes to represent the skill (e.g., 'Empathy' = soft circles/curves, 'Closing' = sharp triangles/arrows, 'Knowledge' = interconnected nodes).
    - Color Palette: Corporate Fintech (Indigo #6366f1, Emerald #10b981, Slate #475569).
    - Background: Transparent or subtle gradient.
    - Format: Return ONLY the raw <svg>...</svg> string. No markdown code blocks.
    - ViewBox: 0 0 100 100.
    - Simplicity: High. Material Design inspired.`;

    try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 1.0 // High temperature for creativity
          }
        });

        let svg = response.text || '';
        svg = svg.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
        
        if (svg && svg.includes('<svg')) {
            avatarCache[cacheKey] = svg;
            return svg;
        }
        throw new Error("Invalid SVG generated");
    } catch (e: any) {
        throw e;
    }
  };

  try {
    // Attempt to generate with AI
    // We limit retries to 1 for avatars to avoid blocking UI if quota is tight
    return await retryOperation(generate, 1, 1000);
  } catch (error: any) {
    // Graceful Fallback
    console.warn(`Avatar generation for ${name} switched to fallback due to: ${error.message}`);
    const fallback = generateFallbackAvatar(name, skill);
    avatarCache[cacheKey] = fallback;
    return fallback;
  }
};
