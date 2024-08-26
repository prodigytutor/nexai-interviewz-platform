"use client";

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider><ChakraProvider>{children}</ChakraProvider></ModalProvider>
    </SessionProvider>
  );
}
