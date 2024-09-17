import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import MockInterviewCard from './mock-interview-card';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image'; // Importing Image component
import prisma from '@/lib/prisma'; // Importing prisma

export default async function MockInterviewList({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const interviews = await prisma?.mockInterview.findMany({
    where: {
      userId: session.user.id as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      site: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return (interviews?.length || 0) > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {interviews.map((interview) => (
        <MockInterviewCard key={interview.id} data={interview} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Interviewz Yet</h1>
      <Image
        alt="missing interviewz"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any interviewz yet. Create one to get started.
      </p>
    </div>
  );
};