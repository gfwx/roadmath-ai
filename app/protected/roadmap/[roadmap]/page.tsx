"use client"

import { useRoadmapContext } from "@/app/context/RoadmapContext";

interface RoadmapPageProps {
  params: { slug: string };
}

export default function RoadmapPage({ params }: RoadmapPageProps) {
  const selectedNode = useRoadmapContext()?.nodeData;
  const selectedRoadmap = useRoadmapContext()?.roadmapData;

  if (selectedNode == null) {
    return (
      <div>
        <h2>This is the roadmap page for: {selectedRoadmap ? selectedRoadmap.title : ""}</h2>
      </div>
    );
  }

  else return (
    <div>
      {/* @ts-ignore */}
      <h1 className='text-xl'>{selectedNode.title}</h1>

      {/* @ts-ignore */}
      <p>{selectedNode.description}</p>
    </div>
  );
}
