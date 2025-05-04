"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";
import { createNewRoadmap, fetchRoadmapFromUser, fetchNodesFromRoadmap, createNodeData } from "@/app/actions";
import type { Tables } from "@/utils/database.types";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLayout } from "@/app/context/LayoutContext";
import { Separator } from "./ui/separator";
import { useRoadmapStore, useSelectedNodeStore } from "@/app/stores/store";
import { useRouter } from "next/navigation";

type Roadmap = Tables<"roadmaps">
type Node = Tables<"node">

export function DashboardComponent({ roadmapData }: { roadmapData: Roadmap[] | null }) {
  const searchParams = useSearchParams();
  const [currentInput, setCurrentInput] = useState("");
  const [currentNodes, setCurrentNodes] = useState<Node[] | null>(null);

  const data = useLayout();
  const router = useRouter();

  const selectedRoadmap = useRoadmapStore((state) => state.roadmap);
  const setSelectedRoadmap = useRoadmapStore((state) => state.setRoadmap);
  const resetSelectedRoadmap = useRoadmapStore((state) => state.resetRoadmap);

  const setSelectedNode = useSelectedNodeStore((state) => state.setNode);
  const resetSelectedNode = useSelectedNodeStore((state) => state.resetNode);

  async function handleSubmit() {
    if (!data.user) return;
    // const response = await getRoadmapEmbeddings(currentInput);

    const res = await createNewRoadmap(currentInput, data.user.age ?? 18, data.user.m_comfort_level ?? 3, "");
    console.log(res.success);
  }

  async function handleNodeSelect(node: Node) {
    if (!selectedRoadmap) return;
    setSelectedNode(node);

    const data = await createNodeData(node, selectedRoadmap);
    console.log(data);

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
                        <h2 className='text-lg font-bold'>{node.data?.title ?? 'No title provided'}</h2>
                        <p className='text-sm'>{node.data?.description ?? 'No description provided'}</p>
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
