import { GoogleGenAI } from '@google/genai';

let aiInstance: any = null;

export function getGemini() {
  if (aiInstance) return aiInstance;
  
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return null;
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}
