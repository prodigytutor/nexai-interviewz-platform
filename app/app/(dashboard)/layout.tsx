import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import CreateInterviewButton from "@/components/create-interview-button";
import NewInterviewModal from "@/components/modal/new-interview";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen dark:bg-black sm:pl-60">
        <div><CreateInterviewButton>
          <NewInterviewModal />
        </CreateInterviewButton>
        </div>
        {children}</div>
    </div>
  );
}
