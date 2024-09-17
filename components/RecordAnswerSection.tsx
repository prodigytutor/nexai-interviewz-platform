"use client"
import { Button } from "@chakra-ui/react"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { generateFeedback } from '@/utils/openai'
import prisma from '@/lib/prisma'
import useUser from '@/lib/hooks/useUser'
import { UpdateUserAnswer } from "@/lib/actions"
import moment from 'moment'
import { interviewQuestionFeedbackPrompt } from "@/lib/prompts"
import { UserAnswer } from "@prisma/client";
interface MockInterviewQuestion {
    question: string;
    answer: string;
}

interface RecordAnswerSectionProps {
    mockInterviewQuestion: MockInterviewQuestion[];
    activeQuestionIndex: number;
    mockId: string;
}

interface ResultType {
    transcript: string;
}

const RecordAnswerSection: React.FC<RecordAnswerSectionProps> = ({ mockInterviewQuestion, activeQuestionIndex, mockId }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const user = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: false,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results) {
            results.forEach(result => {
                if (typeof result !== 'string' && 'transcript' in result) {
                    setUserAnswer(prevAns => prevAns + result.transcript);
                }
            });
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer?.length > 10) {
            console.log("getting ready to update user answer");
            UpdateUserAns();
        }
    }, [isRecording, userAnswer]);

    const StartStopRecording = async () => {
        try {
            if (isRecording) {
                stopSpeechToText();
            } else {
                startSpeechToText();
            }
        } catch (err) {
            console.error("Error starting/stopping recording:", err);
            toast.error("An error occurred while starting/stopping recording.");
        }
    }

    const UpdateUserAns = async () => {
        setLoading(true);
        try {
         
            const feedbackPrompt = interviewQuestionFeedbackPrompt({ mockInterviewQuestion: mockInterviewQuestion[activeQuestionIndex]?.question, userAnswer: userAnswer });
         console.info("the feedback prompt is", feedbackPrompt)
            const result = await generateFeedback("gpt-4o", feedbackPrompt);
         
            console.log("the feedback response is", result);

            // Assuming result is a string and needs to be parsed
            const mockJsonResp = result?.replace('```json', '').replace('```', '');
            const JsonFeedbackResp = JSON.parse(mockJsonResp || '');
console.log("JsonFeedbackResponse", JsonFeedbackResp)
console.log("user email", user?.email)
            if (user?.email) {
                const resp = await UpdateUserAnswer({
                    useremail: user.email, 
                    mockid: mockId,  
                    question: mockInterviewQuestion[activeQuestionIndex]?.question, 
                    answer: mockInterviewQuestion[activeQuestionIndex]?.answer, 
                    userAnswer: userAnswer, 
                    feedback: JsonFeedbackResp?.feedback, 
                    rating: JsonFeedbackResp?.rating
                });

            if (resp.length > 0) {
                    toast.success('User Answer recorded successfully');
                    setUserAnswer('');
                    setResults([]);
            } else {
                toast.error("User email is not available.");
            }
        }
        } catch (err) {
            console.error("Error updating user answer:", err);
            toast.error("An error occurred while updating the user answer.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200}
                    className='absolute' alt="Webcam Placeholder" />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 500,
                        width: 500,
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant="outline" className="my-10"
                onClick={StartStopRecording}
            >
                {isRecording ?
                    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                        <StopCircle />Stop Recording
                    </h2>
                    :
                    <h2 className='text-green-600 flex gap-2 items-center'>
                        <Mic />Start Recording
                    </h2>
                }
            </Button>
        </div>
    );
}

export default RecordAnswerSection;