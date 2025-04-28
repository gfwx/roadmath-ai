"use client"

import { useRoadmapStore } from "@/app/stores/store";
import { useSelectedNodeStore } from "@/app/stores/store";

interface RoadmapPageProps {
  params: { slug: string };
}

export default function RoadmapPage({ params }: RoadmapPageProps) {

  const selectedRoadmap = useRoadmapStore((state) => state.roadmap);
  const selectedNode = useSelectedNodeStore((state) => state.node)

  if (selectedNode == null || selectedNode.data == null) {
    return (
      <div>
        <h2>This is the roadmap page for: {selectedRoadmap ? selectedRoadmap.title : ""}</h2>
      </div>
    );
  }

  else return (
    <div>
      {/* @ts-ignore */}
      <h1 className='text-xl'>{selectedNode.data.title}</h1>

      {/* @ts-ignore */}
      <p>{selectedNode.data.description}</p>
    </div>
  );
}
