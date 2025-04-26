"use client"

import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { createNewRoadmap, fetchRoadmapFromUser } from "@/app/actions";
import type { Tables } from "@/utils/database.types";
import { getRoadmapEmbeddings, getAiResponse } from "@/app/actions";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Divide } from "lucide-react";
import { useLayout } from "@/app/context/LayoutContext";


type Roadmap = Tables<"roadmaps">

export function DashboardComponent({ roadmapData }: { roadmapData: Roadmap[] | null }) {
  const searchParams = useSearchParams();
  const [currentInput, setCurrentInput] = useState("");
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const data = useLayout();

  async function handleSubmit() {
    if (!data.user) return;
    // const response = await getRoadmapEmbeddings(currentInput);

    const res = await createNewRoadmap(currentInput, data.user.age ?? 18, data.user.m_comfort_level ?? 3, "");
    console.log(res.success);
  }
  useEffect(() => {
    const roadmapId = searchParams.get('roadmap');

    if (!roadmapId) {
      setCurrentRoadmap(null); // 🧼 clear it
      return;
    }

    if (currentRoadmap?.id === roadmapId) return;

    fetchRoadmapFromUser(roadmapId).then((roadmap) => {
      //@ts-ignore
      setCurrentRoadmap(roadmap);
    });
  }, [searchParams, currentRoadmap?.id]);
  return (
    <main className="flex flex-col min-w-64  mx-auto pt-16 w-full h-full">
      <div className="flex flex-col gap-2 bottom-0 mt-32 items-center ">
        {!currentRoadmap ? (
          <>
            <h1 className="text-2xl font-bold self-center">Create a new roadmap</h1>
            <div className="flex gap-4 items-stretch h-12 w-full max-w-screen-md">
              <Textarea
                className="border-primary border-2 resize-none w-full "
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="What's relentlessly bogging your mind?" />
              <form>
                <SubmitButton pendingText="Waiting.." formAction={handleSubmit} className="h-full"> Send </SubmitButton>
              </form>
            </div>
          </>
        ) : (
          <div className='w-fit break-words max-w-full'>
            {JSON.stringify(currentRoadmap)}
          </div>
        )}
      </div>
    </main>
  );
}
