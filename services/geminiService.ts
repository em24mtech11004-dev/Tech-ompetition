import { GoogleGenAI, Type } from "@google/genai";
import { SimplifiedReport } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
// Note: In a production app, you might lazily initialize this to handle key rotation or missing keys gracefully.
const ai = new GoogleGenAI({ apiKey: API_KEY });

const GENERATION_MODEL = 'gemini-3-flash-preview';

export const simplifyMedicalReport = async (reportText: string): Promise<SimplifiedReport> => {
  if (!reportText.trim()) throw new Error("Report text is empty");

  try {
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: `You are an expert medical assistant helping a patient understand their medical report. 
      Analyze the following medical text and provide a structured simplification.
      
      Medical Text: "${reportText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A simple, jargon-free summary of the report in 2-3 sentences.",
            },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING, description: "Simple definition for the patient." }
                }
              }
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable steps or questions for the doctor."
            }
          },
          required: ["summary", "keyTerms", "actionItems"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SimplifiedReport;
  } catch (error) {
    console.error("Error simplifying report:", error);
    throw error;
  }
};

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: GENERATION_MODEL,
      config: {
        systemInstruction: "You are HealthPulse, a compassionate and knowledgeable health wellness assistant. You help users understand general health concepts, track their wellness, and prepare for doctor visits. IMPORTANT: You do not provide medical diagnoses. Always advise users to consult a professional for medical advice. Keep answers concise and encouraging.",
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending chat message:", error);
    return "I'm having trouble connecting to the service right now. Please try again later.";
  }
};