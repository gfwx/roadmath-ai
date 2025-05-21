"use client"

import { createNewRoadmap, createNodeData, fetchNodesFromRoadmap, fetchRoadmapFromUser } from "@/lib/db";
import { useLayout } from "@/app/context/LayoutContext";
import { useRoadmapStore, useSelectedNodeStore } from "@/app/stores/store";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/utils/database.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";

type Roadmap = Tables<"roadmaps">
type Node = Tables<"node">

export function DashboardComponent({ roadmapData }: { roadmapData: Roadmap[] | null }) {
  const searchParams = useSearchParams();
  const [currentInput, setCurrentInput] = useState("");
  const [currentNodes, setCurrentNodes] = useState<Node[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const data = useLayout();
  const router = useRouter();

  const selectedRoadmap = useRoadmapStore((state) => state.roadmap);
  const setSelectedRoadmap = useRoadmapStore((state) => state.setRoadmap);
  const resetSelectedRoadmap = useRoadmapStore((state) => state.resetRoadmap);

  const setSelectedNode = useSelectedNodeStore((state) => state.setNode);
  const resetSelectedNode = useSelectedNodeStore((state) => state.resetNode);

  async function handleSubmit() {
    if (!data.user) return;
    const res = await createNewRoadmap(currentInput, data.user.age ?? 18, data.user.m_comfort_level ?? 3, "");
  }

  async function handleNodeSelect(node: Node) {
    if (!selectedRoadmap) return;
    setSelectedNode(node);

    console.log(node);

    setLoading(true);
    const data = await createNodeData(node, selectedRoadmap);

    setLoading(false);
    router.push(`/protected/roadmap/${node.id}`)
  }

  useEffect(() => {
    resetSelectedNode();
    const roadmapId = searchParams.get('roadmap');

    if (!roadmapId) {
      resetSelectedRoadmap();
      return;
    }

    if (selectedRoadmap?.id !== roadmapId) {
      fetchRoadmapFromUser(roadmapId).then((roadmap) => {
        setSelectedRoadmap(roadmap);
      });
    }

    fetchNodesFromRoadmap(roadmapId).then((nodes) => {
      setCurrentNodes(nodes);
    });

  }, [searchParams]);

  return (
    <main className="flex flex-col min-w-64  mx-auto pt-16 w-full h-full">
      <div className="flex flex-col gap-2 bottom-0 items-center ">
        {!selectedRoadmap ? (
          <>
            <h1 className="text-2xl font-bold self-center">Create a new roadmap</h1>
            <div className="flex gap-4 items-stretch h-12 w-full max-w-screen-md">
              <Input
                className="border-primary border-2 resize-none w-full "
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="What's relentlessly bogging your mind?" />
              <form>
                <SubmitButton pendingText="Waiting.." formAction={handleSubmit} className=""> Send </SubmitButton>
              </form>
            </div>
          </>
        ) : (
          <div className='w-fit break-words max-w-full'>
            <section >
              <h1 className='text-2xl font-bold'>
                {selectedRoadmap.title}
              </h1>

              <p>
                {selectedRoadmap.description}
              </p>
            </section>

            <Separator className="my-4" />

            {currentNodes &&
              <section className="flex flex-col gap-4">
                {currentNodes.map((node) => (
                  <div key={node.id}>
                    <Card className='transition-all hover:bg-primary hover:text-card cursor-pointer' onClick={() => handleNodeSelect(node)}>
                      <CardHeader />
                      <CardContent>
                        <h2 className='text-lg font-bold'>{node.title ?? 'No title provided'}</h2>
                        <p className='text-sm'>{node.description ?? 'No description provided'}</p>
                      </CardContent>
                      <CardFooter>
                        {node.id}
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </section>
            }
          </div>
        )}
      </div>
    </main>
  );
}
