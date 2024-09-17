import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import Link from "next/link";
import PlaceholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";
import MockInterviewList from "@/components/mock-interview-list";
import Script from 'next/script'
export default function Overview() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <script id="productly">
  {`(function (w, d, f) {
    var a = d.getElementsByTagName('head')[0];
    var s = d.createElement('script');
    s.async = 1;
    s.src = f;
    s.setAttribute('id', 'produktlyScript');
    s.dataset.clientToken = "9d44f653cbabf667977ab859ab5cce53647fe13d188e338dbd834dd7eaa03f1418ac4e5f2536e733f318654acd091e510335233b54497f8020d5740f3728d495cb539fe487876d30ccd132befddbfb9e948f45c5b5023cfd800002e8bee127cc3e3bb1c3";
    a.appendChild(s);
  })(window, document, "https://public.produktly.com/js/main.js");`}
</script>
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Interview Overview
        </h1>
        <OverviewStats />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Personal Interview Site
          </h1>
          <Suspense fallback={null}>
            <OverviewSitesCTA />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites limit={4} />
        </Suspense>
      </div>

      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Recent Interviewz
        </h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <MockInterviewList limit={8} />
        </Suspense>
      </div>
    </div>
  );
}
