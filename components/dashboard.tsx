"use client"

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { createNewRoadmap, fetchRoadmapFromUser, fetchNodesFromRoadmap } from "@/app/actions";
import type { Tables } from "@/utils/database.types";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLayout } from "@/app/context/LayoutContext";
import { Separator } from "./ui/separator";
import { useRoadmapStore, useSelectedNodeStore } from "@/app/stores/store";

type Roadmap = Tables<"roadmaps">
type Node = Tables<"node">

export function DashboardComponent({ roadmapData }: { roadmapData: Roadmap[] | null }) {
  const searchParams = useSearchParams();
  const [currentInput, setCurrentInput] = useState("");
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [currentNodes, setCurrentNodes] = useState<Node[] | null>(null);

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
      setCurrentRoadmap(roadmap);
    });

    fetchNodesFromRoadmap(roadmapId).then((nodes) => {
      //@ts-ignore
      setCurrentNodes(nodes);
    });

  }, [searchParams, currentRoadmap?.id]);

  return (
    <main className="flex flex-col min-w-64  mx-auto pt-16 w-full h-full">
      <div className="flex flex-col gap-2 bottom-0 items-center ">
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
            <section >
              <h1 className='text-2xl font-bold'>
                {currentRoadmap.title}
              </h1>

              <p>
                {currentRoadmap.description}
              </p>
            </section>

            <Separator className="my-4" />

            {currentNodes &&

              <section className="flex flex-col gap-4">
                {currentNodes.map((node) => (
                  <div key={node.id}>
                    <Link href={`/protected/roadmap/${currentRoadmap.id}?query=${node.id}`}>
                      <Card className='transition-all hover:bg-primary hover:text-card'>
                        <CardHeader />
                        <CardContent>
                          <h2 className='text-lg font-bold'>{node.data?.title ?? 'No title provided'}</h2>
                          <p className='text-sm'>{node.data?.description ?? 'No description provided'}</p>
                        </CardContent>
                        <CardFooter>
                          {node.id}
                        </CardFooter>
                      </Card>
                    </Link>
                  </div>
                ))}
              </section>
            }
            {/* {JSON.stringify(currentRoadmap)} */}
          </div>
        )}
      </div>
    </main>
  );
}
