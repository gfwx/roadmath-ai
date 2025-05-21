import type { Tables } from "@/utils/database.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Roadmap = Tables<"roadmaps">;
type Node = Tables<"node">
type NodeData = Tables<"node_data">

type RoadmapStore = {
  roadmap: Roadmap | null;
  setRoadmap: (roadmap: Roadmap) => void;
  resetRoadmap: () => void;
}

type SelectedNodeStore = {
  node: Node | null;
  nodeData: Partial<NodeData> | null;
  setNode: (node: Node, nodeData: Partial<NodeData>) => void;
  resetNode: () => void;
}


export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set) => ({
      roadmap: null,
      setRoadmap: (roadmap) => set({ roadmap }),
      resetRoadmap: () => set({ roadmap: null }),
    }),
    {
      name: 'roadmap-storage',
      partialize: (state) => ({ roadmap: state.roadmap })
    }
  )
);

export const useSelectedNodeStore = create<SelectedNodeStore>()(
  persist(
    (set) => ({
      node: null,
      nodeData: null,
      setNode: (node: Node, nodeData: Partial<NodeData>) => set({ node, nodeData }),
      resetNode: () => set({ node: null, nodeData: null }),

    }),
    {
      name: 'selected-node-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ node: state.node, nodeData: state.nodeData })
    }
  )
);
