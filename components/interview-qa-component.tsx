"use client";
import React, { useState, useEffect } from 'react';

interface InterviewQuestion {
  question: string;
  answer: string;
}

interface InterviewData {
  interview_questions: InterviewQuestion[];
}

const InterviewQAComponent: React.FC<InterviewData> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!props.interview_questions || props.interview_questions.length === 0) {
      setError("No interview questions available.");
    }
  }, [props.interview_questions]);

  const handleNext = () => {
    try {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % props.interview_questions.length
      );
    } catch (err) {
      setError("An error occurred while navigating to the next question.");
    }
  };

  const handlePrev = () => {
    try {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + props.interview_questions.length) % props.interview_questions.length
      );
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
      <p>{props.interview_questions[currentIndex].question}</p>
      <h3>Answer</h3>
      <p>{props.interview_questions[currentIndex].answer}</p>
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default InterviewQAComponent;
