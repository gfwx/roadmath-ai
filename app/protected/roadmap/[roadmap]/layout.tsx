import { ReactNode } from "react";
import { fetchNodeData } from "@/app/actions";
import { useLayout } from "@/app/context/LayoutContext";
import { useRoadmapStore, useSelectedNodeStore } from "@/app/stores/store";

interface RoadmapLayoutProps {
  children: ReactNode;
  params: { slug: string, query: string };
}

export default async function RoadmapLayout({ children, params }: RoadmapLayoutProps) {
  return (
    <div className="min-h-screen p-6 pt-16">
      <main>{children}</main>
    </div>
  );
}
