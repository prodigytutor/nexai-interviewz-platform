import InterviewQAComponent from '../../../../_components/';
import { JsonArray } from '@prisma/client/runtime/library';
import React, { useEffect, useState, useCallback } from 'react';
import prisma from '../lib/prisma'; // Ensure you have the correct path to your prisma instance

type Props = {
    id: string;
};

type InterviewData = {
    questions: JsonArray;
};

export default function InterviewStartPage({ id }: Props) {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState<JsonArray | null>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const GetInterviewDetails = useCallback(async () => {
        try {
            const result = await prisma?.mockInterview.findFirst({
                where: {
                    id: id,
                },
            });

            const jsonMockResp = result?.questions || [];
            //console.log(jsonMockResp);
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result);
        } catch (error) {
            console.error('Failed to fetch interview details:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        setLoading(true);
        GetInterviewDetails();
    }, [GetInterviewDetails]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <InterviewQAComponent interview_questions={mockInterviewQuestion} mockId={id} />
        </div>
    );
}