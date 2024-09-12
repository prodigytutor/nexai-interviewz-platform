import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    ChatSession,
  } from "@google/generative-ai";
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  export const startMockInterview = async (
    jobPosition: string,
    jobDesc: string,
    jobExperience: string
  ) => {
    try {
      const chatSession: ChatSession = await model.startChat({
        generationConfig,
        safetySettings,
      });
  
      // Set the context for the interview
      await chatSession.sendMessage(
        `You are an experienced interviewer for the role of ${jobPosition}. The job description is: ${jobDesc}. The ideal candidate has ${jobExperience} experience.  Craft a series of ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions that are relevant to the role and assess the candidate's skills and experience.`
      );
  
      // Get the first question
      const firstQuestionResponse = await chatSession.sendMessage(
        "Please ask the first interview question."
      );
  
      return {
        chatSession,
        firstQuestion: firstQuestionResponse.candidates[0].content.parts[0],
      };
    } catch (error) {
      console.error("An error occurred", error);
      throw error; // Re-throw the error if needed
    }
  };
  
  export const getFeedback = async (
    chatSession: ChatSession,
    userAnswer: string
  ) => {
    try {
      // Send the user's answer to the chat session
      await chatSession.sendMessage(userAnswer);
  
      // Get the feedback from Gemini
      const feedbackResponse = await chatSession.sendMessage(
        "Please provide feedback on the user's answer and suggest next steps."
      );
  
      return feedbackResponse.candidates[0].content.parts[0];
    } catch (error) {
      console.error("An error occurred", error);
      throw error; // Re-throw the error if needed
    }
  };
  
  export const getNextQuestion = async (chatSession: ChatSession) => {
    try {
      // Get the next question from Gemini
      const nextQuestionResponse = await chatSession.sendMessage(
        "Please ask the next interview question."
      );
  
      return nextQuestionResponse.candidates[0].content.parts[0];
    } catch (error) {
      console.error("An error occurred", error);
      throw error; // Re-throw the error if needed
    }
  };
  
  export const endMockInterview = async (chatSession: ChatSession) => {
    try {
      // Get the final feedback and recommendations from Gemini
      const finalFeedbackResponse = await chatSession.sendMessage(
        "Please provide final feedback and recommendations for the user based on their performance in the mock interview."
      );
  
      return finalFeedbackResponse.candidates[0].content.parts[0];
    } catch (error) {
      console.error("An error occurred", error);
      throw error; // Re-throw the error if needed
    }
  };
  