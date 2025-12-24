
import { GoogleGenAI, Type } from "@google/genai";
import { CallAnalysis, PiiSettings, DictionaryItem, FullDashboardContext } from "../types";

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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
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
    Follow piiSettings for redaction.
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    return JSON.parse(response.text.trim()) as CallAnalysis;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const sendChatQuery = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string,
  dashboardContext: FullDashboardContext,
  referenceText: string = ''
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const systemInstruction = `You are the OmniAssure FinAI Intelligence Assistant.
    You have absolute access to all data on the dashboard for deep context analysis.
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: { systemInstruction },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "No response.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};
