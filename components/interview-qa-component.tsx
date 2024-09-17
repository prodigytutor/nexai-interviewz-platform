"use client";
import React, { useState, useEffect } from 'react';
import RecordAnswerSection from "./RecordAnswerSection";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  ButtonGroup,
  Button
} from '@chakra-ui/react';

interface InterviewQuestion {
  question: string;
  answer: string;
}

type InterviewData = {
  data: Array<InterviewQuestion>;
};

export default function InterviewQAComponent({ data, mockId }: InterviewData & { mockId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  console.log("the type of interview questions is", typeof data);

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
      <Card variant={'elevated'}>
        <CardHeader>
          <Heading size='md'>Question {currentIndex + 1} of {data.length}</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Question
              </Heading>
              <Text pt='2' fontSize='sm'>
                {data[currentIndex].question}
              </Text>
            </Box>
            <Box>
            <Heading size='xs' textTransform='uppercase'>
                Your answer
              </Heading>
              <RecordAnswerSection
       mockInterviewQuestion={data}
      activeQuestionIndex={currentIndex}
        interviewData={data}
      />
            </Box>
            { isAnswerVisible && (
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Answer
              </Heading>
              <Text pt='2' fontSize='sm'>
                {data[currentIndex].answer}
              </Text>
            </Box>
            )}
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Feedback
              </Heading>
              <Text pt='2' fontSize='sm'>
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
          </Stack>
        </CardBody>
        <CardFooter>
          <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue' onClick={handleNext}>
              Next Question
            </Button>
            <Button variant='ghost' colorScheme='blue' onClick={handlePrev}>
              Previous Question
            </Button>
            <Button variant='ghost' colorScheme='blue' onClick={() => setIsAnswerVisible(!isAnswerVisible)}>
              Show Answer
            </Button>
            <Button variant='ghost' colorScheme='blue'>
              End Interview
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
     
    </div>
  );
};