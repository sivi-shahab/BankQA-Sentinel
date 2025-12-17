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
        productName: { type: Type.STRING, description: "Nama produk perbankan" },
        customerName: { type: Type.STRING, description: "Nama lengkap nasabah" },
        dateOfBirth: { type: Type.STRING, description: "Tanggal lahir nasabah" },
        identityNumber: { type: Type.STRING, description: "Nomor identitas (NIK/KTP)" },
        motherMaidenName: { type: Type.STRING, description: "Nama gadis ibu kandung" },
        bankAccountNumber: { type: Type.STRING, description: "Nomor rekening bank tujuan transfer" },
        targetBankName: { type: Type.STRING, description: "Nama bank tujuan transfer" },
        contributionAmount: { type: Type.STRING, description: "Nilai kontribusi/premi/biaya" },
        phoneNumber: { type: Type.STRING, description: "Nomor telepon aktif" },
        emailAddress: { type: Type.STRING, description: "Alamat email" },
        occupation: { type: Type.STRING, description: "Pekerjaan nasabah" },
        residentialAddress: { type: Type.STRING, description: "Alamat lengkap tempat tinggal" }
      },
      required: [
        "productName", "customerName", "dateOfBirth", "identityNumber", 
        "motherMaidenName", "bankAccountNumber", "targetBankName", 
        "contributionAmount", "phoneNumber", "emailAddress", 
        "occupation", "residentialAddress"
      ],
      description: "Detailed CRM data points extracted individually from the conversation."
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
            1. Transcribe the audio accurately using speaker diarization.
            2. Evaluate adherence to banking compliance.
            3. Identify banking terminology.
            4. Suggest next best actions.
            5. Assign a quality score (0-100).
            6. EXTRACT KEY DATA: Identify specific fields in the 'extractedInfo' object. If a field is not mentioned, use "Tidak disebutkan".
            7. ANALYZE CONVERSATION FLOW: Calculate talk ratios.
    `;

    if (referenceText) {
        systemPrompt += `
        
        *** REFERENCE DOCUMENT / KNOWLEDGE BASE PROVIDED ***
        Use the content below to evaluate the agent's performance strictly against these guidelines.
        
        [REFERENCE START]
        ${referenceText}
        [REFERENCE END]
        `;
    }

    if (redactPII) {
      systemPrompt += `
      
      *** SECURITY GUARDRAIL ACTIVE: STRICT PII REDACTION REQUIRED ***
      You MUST identify and redact all Personally Identifiable Information (PII).
      Replace real values with placeholders like [NAME REDACTED], [PHONE REDACTED], [ACCOUNT REDACTED], [DOB REDACTED], etc.
      Even in the 'extractedInfo' JSON object, use these redacted placeholders if redaction is ON.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
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
        temperature: 0.1,
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
    `;

    if (referenceText) {
        systemInstruction += `
        
        *** REFERENCE KNOWLEDGE BASE ***
        The user has uploaded a reference document. Use it for context.
        
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
