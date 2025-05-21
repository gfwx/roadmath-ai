"use client"

import { ReactNode } from "react";
import { useRoadmapStore, useSelectedNodeStore } from "@/app/stores/store";
import { RoadmapLayoutProvider } from "@/app/context/RoadmapContext";

interface RoadmapLayoutProps {
  children: ReactNode;
  params: { slug: string, query: string };
}

export default function RoadmapLayout({ children, params }: RoadmapLayoutProps) {
  const node = useSelectedNodeStore((state) => state.node);
  const node_data = useSelectedNodeStore((state) => state.nodeData)
  const roadmap = useRoadmapStore((state) => state.roadmap);

  console.log(node_data);

  return (
    <RoadmapLayoutProvider node={node} roadmap={roadmap} node_data={node_data}>
      <div className="min-h-screen p-6 pt-16">
        <main>{children}</main>
      </div>
    </RoadmapLayoutProvider>
  );
}
