import { createContext, useContext } from 'react'
import type { Tables } from '@/utils/database.types'

type Node = Tables<'node'>;
type Roadmap = Tables<'roadmaps'>;
type NodeData = Tables<'node_data'>;

type RoadmapLayoutContextType = {
  node: Node | null;
  node_data: Partial<NodeData> | null;
  roadmap: Roadmap | null;
};

const RoadmapLayoutContext = createContext<RoadmapLayoutContextType | null>(null);

export const RoadmapLayoutProvider = ({ node, node_data, roadmap, children }: { node: Node | null, node_data: Partial<NodeData> | null, roadmap: Roadmap | null, children: React.ReactNode }) => {
  return (
    <RoadmapLayoutContext.Provider value={{ node, node_data, roadmap }}>
      {children}
    </RoadmapLayoutContext.Provider>
  );
};

export const useRoadmapContext = () => useContext(RoadmapLayoutContext);
