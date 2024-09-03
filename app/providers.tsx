"use client";

import { ChakraProvider, createStandaloneToast  } from '@chakra-ui/react'
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const { ToastContainer, toast } = createStandaloneToast()
  return (
    <SessionProvider>
      <ModalProvider><ToastContainer /><ChakraProvider>{children}</ChakraProvider></ModalProvider>
    </SessionProvider>
  );
}
