"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode, useEffect, useState } from "react";
import { getSiteIdFromUserId } from "@/lib/actions";
import { toast } from "sonner";

export default function CreateInterviewButton({
  children,
  userid,
}: {
  children: ReactNode;
  userid: string;
}) {
  const modal = useModal();
  const [site, setSite] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSite() {
      const siteId = await getSiteIdFromUserId(userid);
      if (!siteId) {
        toast.error("Could not find a site for the logged in user. Please create a default site first!");
      }
      setSite(siteId);
    }
    fetchSite();
  }, [userid]);

  if (!site) {
    return null;
  }

  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      Setup New Interview
    </button>
  );
}