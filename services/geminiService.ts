
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractDocumentInfo = async (base64Image: string, documentType: 'ID' | 'CPF') => {
  try {
    const prompt = documentType === 'ID' 
      ? "This is a Brazilian Identity Document (RG or CNH). Extract the full name and the registration number (RG). Format the name in Title Case."
      : "This is a Brazilian CPF document or card. Extract the full name and the CPF number in the format XXX.XXX.XXX-XX.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
          },
          required: ["fullName", "documentNumber"]
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Error in OCR extraction:", error);
    return null;
  }
};
