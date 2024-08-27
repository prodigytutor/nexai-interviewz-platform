import { InlineSnippet } from "@/components/form/domain-configuration";
import { Link } from "@chakra-ui/react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms on Vercel"
        className="w-48"
      />
      <h1 className="text-white">
        <Link href="/login">Get Started</Link>
      </h1>
    </div>
  );
}
