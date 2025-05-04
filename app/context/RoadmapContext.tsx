import { createContext, useContext } from 'react'
import type { Tables } from '@/utils/database.types'
import { useSelectedNodeStore } from '../stores/store';

type Node = Tables<'node'>;
type Roadmap = Tables<'roadmaps'>;

type RoadmapLayoutContextType = {
  nodeData: Node | null;
  roadmapData: Roadmap | null;
};

const RoadmapLayoutContext = createContext<RoadmapLayoutContextType | null>(null);

export const RoadmapLayoutProvider = ({ nodeData, roadmapData, children }: { nodeData: Node | null, roadmapData: Roadmap | null, children: React.ReactNode }) => {
  return (
    <RoadmapLayoutContext.Provider value={{ nodeData, roadmapData }}>
      {children}
    </RoadmapLayoutContext.Provider>
  );
};

export const useRoadmapContext = () => useContext(RoadmapLayoutContext);
