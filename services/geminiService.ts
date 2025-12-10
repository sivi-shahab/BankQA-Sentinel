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
    }
  },
  required: ["transcriptSegments", "summary", "qualityScore", "sentiment", "nextBestActions", "complianceChecklist", "glossaryUsed"]
};

export const analyzeTelemarketingAudio = async (base64Audio: string): Promise<CallAnalysis> => {
  try {
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
            text: `You are a Senior Quality Control Auditor for a major bank. 
            Analyze this telemarketing call recording. 
            1. Transcribe the audio accurately using speaker diarization (identify "Agent" vs "Customer" vs "System").
            2. Evaluate adherence to banking compliance (Verification, Disclosures, Professionalism).
            3. Identify banking terminology used and provide a glossary context.
            4. Suggest next best actions for the sales process.
            5. Assign a quality score (0-100).
            `
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
  contextData?: CallAnalysis
): Promise<string> => {
  try {
    const systemInstruction = `You are an AI Assistant for a Banking Quality Control Dashboard.
    You have access to the analysis of a specific telemarketing call.
    
    Context Data:
    ${contextData ? JSON.stringify(contextData) : 'No specific call context loaded yet.'}
    
    Answer the user's questions about the call, banking regulations, or sales techniques based on this context.
    Keep answers concise and professional.
    `;

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
