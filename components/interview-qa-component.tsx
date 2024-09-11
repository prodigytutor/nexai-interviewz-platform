"use client";
import React, { useState, useEffect } from 'react';

interface InterviewQuestion {
  question: string;
  answer: string;
}

interface InterviewData {
  interview_questions: InterviewQuestion[] | null;
}

export default function InterviewQAComponent({ interview_questions }: InterviewData) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  //console.log("interview_questions", interview_questions)
  //console.log("these are the interview questions", interview_questions)
  useEffect(() => {
    if (!interview_questions || interview_questions.length === 0) {
      setError("No interview questions available.");
    }
  }, [interview_questions]);

  const handleNext = () => {
    try {
      if (interview_questions && interview_questions.length > 0) {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % interview_questions.length
        );
      }
    } catch (err) {
      setError("An error occurred while navigating to the next question.");
    }
  };

  const handlePrev = () => {
    try {
      if (interview_questions && interview_questions.length > 0) {
        setCurrentIndex((prevIndex) => 
          (prevIndex - 1 + interview_questions.length) % interview_questions.length
        );
      }
    } catch (err) {
      setError("An error occurred while navigating to the previous question.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Interview Question</h2>
      <p>{interview_questions[currentIndex].question}</p>
      <h3>Answer</h3>
      <p>{interview_questions[currentIndex].answer}</p>
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};