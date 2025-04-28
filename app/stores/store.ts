import type { Tables } from "@/utils/database.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Roadmap = Tables<"roadmaps">;
type Node = Tables<"node">

type RoadmapStore = {
  roadmap: Roadmap | null;
  setRoadmap: (roadmap: Roadmap) => void;
  resetRoadmap: () => void;
}

type SelectedNodeStore = {
  node: Node | null;
  setNode: (nodes: Node) => void;
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
      setNode: (node: Node) => set({ node }),
      resetNode: () => set({ node: null }),
    }),
    {
      name: 'selected-node-storage',
      partialize: (state) => ({ node: state.node })
    }
  )
);
