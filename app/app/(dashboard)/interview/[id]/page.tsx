"use client"
import { Button } from '@chakra-ui/react'
import prisma from '@/lib/prisma'
import { useRouter } from 'next/navigation'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { getInterviewDetails } from '@/lib/actions'
export default function Interview({ params }: { params: { id: string } }) {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const effectHandler = async()=>{
        const resultGen = await getInterviewDetails(params.id);
        const result = JSON.parse(JSON.stringify(resultGen))
        setInterviewData(result)
       }
    useEffect(() => {
        effectHandler()        
    }, [getInterviewDetails])

      if (loading) {
        return <div>Loading...</div>;
    }

   return (
    <div>
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Shall We Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.role}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData?.topic}</h2>
                        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData?.experience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                height: 300,
                                width: 300
                            }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end'>
                <Link href={`/interview/${params.id}/start`}>
                    <Button>Start Interview</Button>
                </Link>
            </div>
        </div>
    </div>
)}