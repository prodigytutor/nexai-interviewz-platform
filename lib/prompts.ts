import React from 'react'

type InterviewPromotProps = {
    numQuestions: string;
    title: string;
    description: string;
    experience: number;
}

export const interviewPromptSystem = (props: InterviewPromotProps) => {
    const {numQuestions, title, description, experience } = props;
  return (
    `Using the information provided below, generate a set of ${numQuestions} interview questions tailored to the specific role. 
    The questions should be designed to assess the candidate's suitability for the position based on 
    their experience and the requirements listed in the job description.* 
    **Parameters:** 
    1. **Job Title**: ${title} 
    2. **Job Description**: ${description} 
    3. **Years of Experience**: ${experience}} 
    **Output:** *Generate a comprehensive list of interview questions and their answers that are directly relevant to the 
    job title and description provided. The questions should vary in complexity based on the 
    years of experience, ensuring they are challenging enough to evaluate the depth of 
    knowledge and practical experience appropriate for the candidate’s level. The list of questions and answers should be returned in 
    json format. You should return only valid json containing question and answer no explanation or additional narrative is needed.`
  )
}

export const interviewPromptUser = (props: InterviewPromotProps) => {
    const {numQuestions, title, description, experience } = props;
  return (
    `Please generate my interview questions`
  )
}