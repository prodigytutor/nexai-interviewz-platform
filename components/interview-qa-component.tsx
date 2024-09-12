"use client";
import React, { useState, useEffect } from 'react';
import RecordAnswerSection from "./RecordAnswerSection";
interface InterviewQuestion {
  question: string;
  answer: string;
}

type InterviewData = {
 data: Array<InterviewQuestion>;
};

export default function InterviewQAComponent({ data }: InterviewData) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
console.log("the type of interview questions is", typeof data)
  // Use useEffect to set error if interview_questions is null or empty
  useEffect(() => {
    if (!data || data.length === 0) {
      setError("No interview questions available.");
    } else {
      setError(null); // Clear error if interview_questions is valid
    }
  }, [data]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if interview_questions is valid before accessing currentIndex
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Interview Question</h2>
      <p>{data[currentIndex].question}</p>
      <h3>Answer</h3>
      <p>{data[currentIndex].answer}</p>
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <RecordAnswerSection
       mockInterviewQuestion={data}
      activeQuestionIndex={currentIndex}
        interviewData={data}
      />
    </div>
  );
};