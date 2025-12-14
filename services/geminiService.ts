import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Sends an image and a text prompt to Gemini to edit/regenerate the image.
 * 
 * @param base64Image The base64 string of the image (without the data:image/... prefix)
 * @param mimeType The mime type of the image (e.g., 'image/png')
 * @param prompt The instruction for the edit
 * @returns The new base64 image string
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to strip the data url prefix if present
 */
export const extractBase64Data = (dataUrl: string): { data: string; mimeType: string } => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string format");
  }
  return {
    mimeType: matches[1],
    data: matches[2],
  };
};