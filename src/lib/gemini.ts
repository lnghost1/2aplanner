import { GoogleGenerativeAI } from '@google/generative-ai';

let aiInstance: any = null;

export const getAI = () => {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return aiInstance;
};
