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
    interview_questions: Array<InterviewQuestion>;
}

export default function InterviewStartPage({ params }: { params: { id: string } }) {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState<Array<InterviewQuestion>>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    console.log("in the interview start page function");

    const effectHandler = useCallback(async () => {
        try {
            const resultGen = await getInterviewDetails(params.id);
            const result = JSON.parse(JSON.stringify(resultGen || []));
            console.log("results are", result);
            setInterviewData(result);
            setMockInterviewQuestion(result?.questions.interview_questions || []);
        } catch (err) {
            console.error("Error fetching interview details:", err);
            setError("Failed to load interview details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        effectHandler();
    }, [effectHandler]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <InterviewQAComponent data={mockInterviewQuestion} />
        </div>
    );
}