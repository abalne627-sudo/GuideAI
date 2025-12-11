
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai"; // Added Type
import { StudentProfile, CareerSuggestion, StreamSuggestion, SkillRecommendation, ChatMessage, ChatRole } from '../types';
import { GEMINI_API_KEY, GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from '../constants';

let ai: GoogleGenAI | null = null;

if (GEMINI_API_KEY && typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.trim() !== '') {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    ai = null;
  }
} else {
  console.error("Critical: API_KEY not available or invalid. Gemini service will not function.");
}

const parseJsonFromGeminiResponse = <T>(responseText: string, context: string): T | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error(`Failed to parse JSON response from Gemini for ${context}:`, e, "Raw response:", responseText);
    return null;
  }
};

// Updated to return AsyncIterable for streaming
export async function* getProfileNarrativeStream(profile: StudentProfile): AsyncIterable<string> {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot fetch profile narrative.");
    yield "Error: AI service not available.";
    return;
  }
  if (!profile.summary) {
    console.error("Profile summary is missing for Gemini API call (profile narrative).");
    yield "Error: Profile summary missing.";
    return;
  }

  const prompt = `
    You are an insightful and encouraging AI career counselor. Based on the following student psychometric profile summary:
    ${profile.summary}

    Please generate a 2-3 paragraph personalized narrative overview for this student.
    This narrative should:
    - Be positive and encouraging.
    - Highlight key strengths and tendencies indicated by the profile.
    - Offer a brief, holistic interpretation of what these traits together might mean for the student's approach to learning, work, and decision-making.
    - Be written in a way that is easy for a student (ages 12-18) to understand and relate to.
    - Do NOT give specific career or stream suggestions in this narrative, as those will be provided separately.
    - Respond ONLY with the narrative text. Do not include greetings, sign-offs, or any other surrounding text.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { temperature: 0.7 },
    });
    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error fetching profile narrative stream from Gemini:", error);
    yield "Error: Could not generate profile narrative.";
  }
}


export const getCareerSuggestions = async (profile: StudentProfile): Promise<CareerSuggestion[]> => {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot fetch career suggestions.");
    return [];
  }
  if (!profile.summary) {
    console.error("Profile summary is missing for Gemini API call (career suggestions).");
    return [];
  }
  const prompt = `
    You are an expert AI career counselor. Based on the student's psychometric profile summary:
    ${profile.summary}
    Suggest 3 diverse career paths suitable for a student in India (common age range 12-18).
    For each career:
    - 'name': The career title.
    - 'description': Brief description (max 30 words).
    - 'rationale': Concise explanation of alignment with profile (max 30 words).
    - 'educationPathIndia': Typical educational pathway in India.
    - 'dayInTheLifeNarrative': A short, engaging "Day in the Life" summary for this career (1-2 sentences, max 40 words).
    
    Return ONLY a valid JSON array of objects.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { 
        responseMimeType: "application/json", 
        temperature: 0.5,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              rationale: { type: Type.STRING },
              educationPathIndia: { type: Type.STRING },
              dayInTheLifeNarrative: { type: Type.STRING },
            },
            required: ["name", "description", "rationale", "educationPathIndia", "dayInTheLifeNarrative"],
          }
        }
      },
    });
    const suggestions = parseJsonFromGeminiResponse<CareerSuggestion[]>(response.text, "career suggestions");
    
    // Sequentially generate images for each suggestion to avoid overwhelming API limits.
    // In a real app, this might be done on-demand or with more robust error handling/rate limiting.
    if (suggestions) {
      for (let i = 0; i < suggestions.length; i++) {
        try {
          suggestions[i].dayInTheLifeImageUrl = await generateCareerImage(suggestions[i].name);
        } catch (imgError) {
          console.error(`Failed to generate image for ${suggestions[i].name}:`, imgError);
          suggestions[i].dayInTheLifeImageUrl = null; // Set to null if image generation fails
        }
      }
    }
    return suggestions || [];

  } catch (error) {
    console.error("Error fetching career suggestions from Gemini:", error);
    return [];
  }
};

export const generateCareerImage = async (careerName: string): Promise<string | null> => {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot generate image.");
    return null;
  }
  const prompt = `A hopeful and positive depiction of a young student in India imagining themselves as a ${careerName}. Professional setting, bright, aspirational.`;
  try {
    const response = await ai.models.generateImages({
        model: GEMINI_IMAGE_MODEL,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });
    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
        return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
    }
    return null;
  } catch (error) {
    console.error(`Error generating image for ${careerName}:`, error);
    return null;
  }
};

export const getStreamSuggestions = async (profile: StudentProfile): Promise<StreamSuggestion[]> => {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot fetch stream suggestions.");
    return [];
  }
   if (!profile.summary) {
    console.error("Profile summary is missing for Gemini API call (stream suggestions).");
    return [];
  }
  const prompt = `
    You are an expert AI academic advisor. Based on the student psychometric profile summary:
    ${profile.summary}
    Suggest 2-3 suitable academic streams for a student in India (after 10th grade).
    For each stream:
    - 'name': Stream name (e.g., "Science (PCM Focus)").
    - 'description': Brief overview (max 30 words).
    - 'rationale': Concise explanation of alignment with profile (max 30 words).
    - 'subjects': Array of 3-5 key subjects.
    
    Return ONLY a valid JSON array of objects.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { 
        responseMimeType: "application/json", 
        temperature: 0.5,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              rationale: { type: Type.STRING },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "description", "rationale", "subjects"]
          }
        }
      },
    });
    const suggestions = parseJsonFromGeminiResponse<StreamSuggestion[]>(response.text, "stream suggestions");
    return suggestions || [];
  } catch (error) {
    console.error("Error fetching stream suggestions from Gemini:", error);
    return [];
  }
};

// New: Chatbot functions
export const startChatSession = (profileSummary: string): Chat | null => {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot start chat.");
    return null;
  }
  const systemInstruction = `You are GuideAI, a friendly and helpful career and academic mentor for students (ages 12-18). You are chatting with a student who has just completed a psychometric assessment.
Their profile summary is: ${profileSummary}
Keep your responses concise, encouraging, and easy to understand. Do not give financial advice or medical advice. Help them explore their results and options.
Answer questions based on their profile and the context of career/academic guidance.`;

  try {
     return ai.chats.create({
        model: GEMINI_TEXT_MODEL,
        config: { systemInstruction: systemInstruction, temperature: 0.7 },
     });
  } catch (error) {
    console.error("Error starting chat session:", error);
    return null;
  }
};

export async function* sendChatMessageStream(chat: Chat, message: string): AsyncIterable<string> {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot send message.");
    yield "Error: AI service not available to send message.";
    return;
  }
  try {
    const responseStream = await chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error sending chat message stream:", error);
    yield "Error: Could not get a response from the mentor.";
  }
}

// New: Get Skill Recommendations
export const getSkillRecommendations = async (profile: StudentProfile, careerContext?: string): Promise<SkillRecommendation[]> => {
  if (!ai) {
    console.error("Gemini AI service not initialized. Cannot fetch skill recommendations.");
    return [];
  }
  if (!profile.summary) {
    console.error("Profile summary is missing for Gemini API call (skill recommendations).");
    return [];
  }

  let contextPrompt = `Based on the following student psychometric profile summary:
${profile.summary}`;
  if (careerContext) {
    contextPrompt += `\nAnd considering their interest in the career/area of: ${careerContext}`;
  }

  const prompt = `
    ${contextPrompt}
    Suggest 2-3 key skills that would be beneficial for this student to develop. These skills should be relevant to their profile and potential career interests.
    For each skill:
    - 'skillName': The name of the skill (e.g., "Python Programming", "Critical Thinking", "Public Speaking").
    - 'description': A brief explanation of the skill (max 20 words).
    - 'relevance': How this skill is relevant to the student's profile or potential interests (max 30 words).
    - 'learningResources': An array of 1-2 suggested learning resources. Each resource object should have 'title', 'url' (use placeholder '#' if actual URL unknown), and 'type' (e.g., "Online Course", "Book", "Website").

    Return your response ONLY as a valid JSON array of objects.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skillName: { type: Type.STRING },
              description: { type: Type.STRING },
              relevance: { type: Type.STRING },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ["title", "url", "type"]
                }
              }
            },
            required: ["skillName", "description", "relevance", "learningResources"]
          }
        }
      },
    });
    const recommendations = parseJsonFromGeminiResponse<SkillRecommendation[]>(response.text, "skill recommendations");
    // if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    //   console.log("Grounding Chunks for Skills:", response.candidates[0].groundingMetadata.groundingChunks);
    //   // Process and potentially add these URLs to the recommendations if structured appropriately.
    // }
    return recommendations || [];
  } catch (error) {
    console.error("Error fetching skill recommendations from Gemini:", error);
    return [];
  }
};

// Helper to get full profile narrative (non-streaming, for convenience if needed elsewhere)
export const getFullProfileNarrative = async (profile: StudentProfile): Promise<string | null> => {
  if (!ai || !profile.summary) return null;
  let fullNarrative = "";
  try {
    for await (const chunk of getProfileNarrativeStream(profile)) {
      fullNarrative += chunk;
    }
    return fullNarrative.startsWith("Error:") ? null : fullNarrative;
  } catch {
    return null;
  }
};
