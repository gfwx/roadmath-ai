import { ReactNode } from "react";
import { fetchNodeData } from "@/app/actions";
import { useLayout } from "@/app/context/LayoutContext";

interface RoadmapLayoutProps {
  children: ReactNode;
  params: { slug: string, query: string };
}

export default async function RoadmapLayout({ children, params }: RoadmapLayoutProps) {
  const { slug, query } = await params;
  // const data = await fetchNodeData(slug, query);

  return (
    <div className="min-h-screen p-6 pt-16">
      <header>{slug}</header>
      {/* <main>{JSON.stringify(data)}</main> */}
    </div>
  );
}
