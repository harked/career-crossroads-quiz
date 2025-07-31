import { GoogleGenAI, Type } from "@google/genai";
import { QUIZ_QUESTIONS } from '../constants';
import { GeminiAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise summary title for the user's situation (e.g., 'Time for a Fresh Start', 'Content but Room to Grow', 'Thriving in Your Role'). Must be encouraging and professional.",
    },
    analysis: {
      type: Type.STRING,
      description: "A detailed, empathetic paragraph analyzing the user's job satisfaction based on their answers. Explain the potential implications of their feelings about their current role.",
    },
    nextSteps: {
      type: Type.ARRAY,
      description: "A list of 3 to 5 concrete, actionable next steps for the user. These steps should be personalized based on their answers.",
      items: { type: Type.STRING },
    },
  },
  required: ['title', 'analysis', 'nextSteps'],
};

export const analyzeJobSatisfaction = async (answers: (number | null)[]): Promise<GeminiAnalysis> => {
  const answerMapping: { [key: number]: string } = {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree",
  };

  const detailedAnswers = QUIZ_QUESTIONS.map((q, index) => {
    const answerValue = answers[index];
    const answerLabel = answerValue ? answerMapping[answerValue] : "Not Answered";
    return `- Question: "${q.text}"\n  - Answer: ${answerValue} (${answerLabel})`;
  }).join('\n');

  const prompt = `
    You are a compassionate and insightful career coach. A user has completed a career satisfaction quiz. Their answers are provided below on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).

    Analyze their responses to assess their current job satisfaction and provide guidance on whether they should consider seeking a new job. Your tone should be supportive and constructive.

    User's Answers:
    ${detailedAnswers}

    Based on this information, generate a JSON object that includes a summary title, a detailed analysis, and a list of actionable next steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    // Validate if the response is a valid JSON
    const result = JSON.parse(jsonText);
    
    // Further validation to ensure it matches the GeminiAnalysis structure
    if (result && typeof result.title === 'string' && typeof result.analysis === 'string' && Array.isArray(result.nextSteps)) {
      return result as GeminiAnalysis;
    } else {
      throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error analyzing job satisfaction:", error);
    // Provide a fallback error response that matches the expected structure
    return {
        title: "Analysis Error",
        analysis: "We encountered an issue while analyzing your results. This could be due to a network issue or an API problem. Please try again later.",
        nextSteps: ["Refresh the page and retake the quiz.", "Check your internet connection."]
    };
  }
};
