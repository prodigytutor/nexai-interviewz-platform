"use client"
import InterviewQAComponent from '@/components/interview-qa-component';
import { JsonArray } from '@prisma/client/runtime/library';
import React, { useEffect, useState, useCallback } from 'react';
import prisma from '@/lib/prisma'; // Ensure you have the correct path to your prisma instance
import { getInterviewDetails } from '@/lib/actions';

type Props = {
    id: string;
};

interface InterviewQuestion {
    question: string;
    answer: string;
  }
  
  interface InterviewData {
    interview_questions: InterviewQuestion[] | null;
  }
export default function InterviewStartPage({ params }: { params: { id: string } }) {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState<InterviewQuestion[] | null>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
console.log("in the interview start page function")
    const effectHandler = async()=>{
        const resultGen = await getInterviewDetails(params.id);
        //console.log("the value of id is", params.id)
        //console.log("the value of resultGen is", resultGen)
        const result = JSON.parse(JSON.stringify(resultGen || []))
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log("results are", result)
        setInterviewData(result)
        setMockInterviewQuestion(result?.questions || [])
       }
    useEffect(() => {
        effectHandler()        
    }, [getInterviewDetails])

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div>
            <InterviewQAComponent interview_questions={mockInterviewQuestion} />
        </div>
    );
}