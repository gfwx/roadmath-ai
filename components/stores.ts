import { create } from "zustand";
import type { Tables } from "@/utils/database.types";

type User = Tables<"users">;
type Roadmap = Tables<"roadmaps">;
type Node = Tables<"node">;

type State = {
  id: string | null;
  title: string;
  description: string;
  authorId: string;
  updateId: (id: string) => void;
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  updateAuthorId: (authorId: string) => void;
};

type Actions = {
  updateId: (id: string | null) => void;
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  updateAuthorId: (authorId: string) => void;
};

export const useCurrentRoadmapStore = create<State & Actions>((set) => ({
  id: null,
  title: "",
  description: "",
  authorId: "",
  updateId: (id: string | null) => set({ id }),
  updateTitle: (title: string) => set({ title }),
  updateDescription: (description: string) => set({ description }),
  updateAuthorId: (authorId: string) => set({ authorId }),
}));
