import type { Tables } from "@/utils/database.types";
import { create } from "zustand";

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

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  roadmap: null,
  setRoadmap: (roadmap: Roadmap) => set({ roadmap }),
  resetRoadmap: () => set({ roadmap: null }),
}));

export const useSelectedNodeStore = create<SelectedNodeStore>((set) => ({
  node: null,
  setNode: (node: Node) => set({ node }),
  resetNode: () => set({ node: null }),
}));
