import React from 'react';
import { Card, CardBody, CardFooter, Stack, Heading, Text, Button, useToast } from '@chakra-ui/react';

interface MockInterviewCardProps {
  data: {
    role?: string;
    topic?: string;
  };
  startInterview: () => void;
}

const MockInterviewCard: React.FC<MockInterviewCardProps> = ({ data, startInterview }) => {
  const toast = useToast();

  const handleStartInterview = () => {
    try {
      startInterview();
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Error',
        description: 'There was an error starting the interview. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardBody>
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
