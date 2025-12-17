import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CallAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcriptSegments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "The identified speaker (e.g., 'Agent', 'Customer', 'System')" },
          text: { type: Type.STRING, description: "The spoken text for this segment" }
        },
        required: ["speaker", "text"]
      },
      description: "Verbatim transcript of the call, separated by speaker (Diarization)."
    },
    summary: { type: Type.STRING, description: "Executive summary of the call focusing on banking outcomes." },
    qualityScore: { type: Type.INTEGER, description: "A score from 0 to 100 rating the agent's performance." },
    sentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"], description: "Overall sentiment of the customer." },
    nextBestActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended next steps for the agent or follow-up actions."
    },
    complianceChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "e.g., Greeting, ID Verification, Disclosure, Closing" },
          status: { type: Type.STRING, enum: ["PASS", "FAIL", "WARNING"] },
          details: { type: Type.STRING, description: "Reason for the status." }
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
          contextInCall: { type: Type.STRING, description: "How it was used in the specific context." }
        },
        required: ["term", "definition", "contextInCall"]
      },
      description: "Banking specific terms detected in the call with definitions."
    },
    extractedInfo: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING, description: "Name of the banking product/service discussed (e.g. Credit Card, Loan, Insurance)" },
        customerName: { type: Type.STRING, description: "Full name of the customer" },
        parentName: { type: Type.STRING, description: "Mother's maiden name or parent name if mentioned for verification" },
        identityNumber: { type: Type.STRING, description: "NIK, KTP, or ID number if mentioned" },
        contributionAmount: { type: Type.STRING, description: "Monthly fee, premium (iuran), or contribution amount discussed" },
        contactInfo: { type: Type.STRING, description: "Phone number, email, or address mentioned" },
        otherDetails: { type: Type.STRING, description: "Any other critical data points (e.g., Date of Birth, Job)" }
      },
      required: ["productName", "customerName", "parentName", "identityNumber", "contributionAmount", "contactInfo", "otherDetails"],
      description: "Key data points extracted from the conversation to fill a CRM form."
    },
    conversationStats: {
      type: Type.OBJECT,
      properties: {
        agentTalkTimePct: { type: Type.NUMBER, description: "Percentage of total conversation time spoken by the Agent (0-100)" },
        customerTalkTimePct: { type: Type.NUMBER, description: "Percentage of total conversation time spoken by the Customer (0-100)" },
        wordsPerMinute: { type: Type.NUMBER, description: "Estimated speaking pace" },
        interruptionCount: { type: Type.NUMBER, description: "Number of times speakers interrupted each other" },
        effectivenessRating: { type: Type.STRING, enum: ['OPTIMAL', 'AGENT_DOMINATED', 'CUSTOMER_DOMINATED'], description: "Rating of the talk-time balance" },
        feedback: { type: Type.STRING, description: "Advice on how to improve the conversation flow based on duration stats." }
      },
      required: ["agentTalkTimePct", "customerTalkTimePct", "wordsPerMinute", "interruptionCount", "effectivenessRating", "feedback"]
    }
  },
  required: ["transcriptSegments", "summary", "qualityScore", "sentiment", "nextBestActions", "complianceChecklist", "glossaryUsed", "extractedInfo", "conversationStats"]
};

export const analyzeTelemarketingAudio = async (base64Audio: string, redactPII: boolean, referenceText: string = ''): Promise<CallAnalysis> => {
  try {
    let systemPrompt = `You are a Senior Quality Control Auditor for a major bank. 
            Analyze this telemarketing call recording. 
            1. Transcribe the audio accurately using speaker diarization (identify "Agent" vs "Customer" vs "System").
            2. Evaluate adherence to banking compliance (Verification, Disclosures, Professionalism).
            3. Identify banking terminology used and provide a glossary context.
            4. Suggest next best actions for the sales process.
            5. Assign a quality score (0-100).
            6. EXTRACT KEY DATA: Fill out the 'extractedInfo' object.
            7. ANALYZE CONVERSATION FLOW: Calculate approximate talk ratios (Share of Voice). Ideally, a consultative sales call should be around 40-60% Agent / 40-60% Customer. If the Agent talks > 70%, it is "AGENT_DOMINATED".
    `;

    if (referenceText) {
        systemPrompt += `
        
        *** REFERENCE DOCUMENT / KNOWLEDGE BASE PROVIDED ***
        The user has provided a reference document (Script, SOP, or Product Manual).
        Use the content below to evaluate the agent's performance strictly against these guidelines.
        
        [REFERENCE START]
        ${referenceText}
        [REFERENCE END]
        
        - If the agent misses steps mentioned in the Reference Document, mark them as FAIL in the compliance checklist.
        - Use product details from the Reference Document to verify accuracy of information given to the customer.
        `;
    }

    if (redactPII) {
      systemPrompt += `
      
      *** SECURITY GUARDRAIL ACTIVE: STRICT PII REDACTION REQUIRED ***
      You MUST identify and redact all Personally Identifiable Information (PII) from the transcript, summary, and any other output.
      Do NOT output real names, phone numbers, credit card numbers, account IDs, or specific addresses.
      
      Replacement Rules:
      - Names -> [NAME REDACTED]
      - Phone Numbers -> [PHONE REDACTED]
      - Credit Card/Account Numbers -> [ACCOUNT REDACTED]
      - Email Addresses -> [EMAIL REDACTED]
      - Home Addresses -> [ADDRESS REDACTED]
      
      IMPORTANT: Even for the 'extractedInfo' object, if PII redaction is ON, you must use the redacted placeholders (e.g., [NAME REDACTED]) instead of the real values.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav', // Assuming WAV from MediaRecorder, Gemini is flexible
              data: base64Audio
            }
          },
          {
            text: systemPrompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Lower temperature for more analytical/factual output
      }
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    return JSON.parse(response.text) as CallAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const sendChatQuery = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string,
  contextData?: CallAnalysis,
  referenceText: string = ''
): Promise<string> => {
  try {
    let systemInstruction = `You are an AI Assistant for a Banking Quality Control Dashboard.
    You have access to the analysis of a specific telemarketing call.
    
    Context Data (Analysis Result):
    ${contextData ? JSON.stringify(contextData) : 'No specific call context loaded yet.'}
    
    Answer the user's questions about the call, banking regulations, or sales techniques based on this context.
    Keep answers concise and professional.
    
    SECURITY NOTE: If the context data has redacted PII (e.g., [NAME REDACTED]), do NOT attempt to guess the real values. Respect the redaction.
    `;

    if (referenceText) {
        systemInstruction += `
        
        *** REFERENCE KNOWLEDGE BASE ***
        The user has uploaded the following reference document (Script/Policy/Product Info).
        Use this information to answer questions about what the agent *should* have said vs what they *did* say.
        
        [REFERENCE DOCUMENT]
        ${referenceText}
        `;
    }

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};
