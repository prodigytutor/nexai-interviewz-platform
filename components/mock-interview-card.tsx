"use client"
import React from 'react';
import { Card, CardBody, CardFooter, Stack, Heading, Text, Button, Image, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
interface MockInterviewCardProps {
  data: {
    id?: string;
    role?: string;
    topic?: string;
  };
}

const MockInterviewCard: React.FC<MockInterviewCardProps> = ({ data}) => {
  //const toast = useToast();
  const router = useRouter();
  const handleStartInterview = () => {
    try {
       router.push(`/interview/${data.id}`)
    } catch (error) {
      console.error('Error starting interview:', error);
      // toast({
      //   title: 'Error',
      //   description: 'There was an error starting the interview. Please try again later.',
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  return (
    <Card className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <CardBody>
        <Image src='/ai-interview.jpg' alt="AI Interview"/>
        <Stack>
          <Heading size="md">{data.role || "No Title"}</Heading>
          <Text>{data.topic || "No Description"}</Text>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleStartInterview}>Start Interview</Button>
      </CardFooter>
    </Card>
  );
}

export default MockInterviewCard;
