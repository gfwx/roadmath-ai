import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { createNewRoadmap } from "@/app/actions";
import type { Tables } from "@/utils/database.types";
import { useProtectedLayout } from "@/app/context/ProtectedLayoutContext";
import { useLayout } from "@/app/context/LayoutContext";

type Roadmap = Tables<"roadmaps">

export function DashboardComponent({ roadmapData }: { roadmapData: Roadmap[] | null }) {
  // edit this
  const { roadmaps } = useLayout();

  return (
    <main className="flex flex-col min-w-64  mx-auto pt-16 w-full h-full">
      <div className="flex flex-col gap-2 relative bottom-0 mt-32 items-center w-full">

        <h1 className="text-2xl font-bold self-center">Create a new roadmap</h1>
        <div className="flex gap-4 items-stretch h-12 w-full max-w-screen-md">
          <Textarea className="border-primary border-2 resize-none w-full " placeholder="What's relentlessly bogging your mind?" />
          <form>
            <SubmitButton pendingText="Waiting.." formAction={createNewRoadmap} className="h-full"> Send </SubmitButton>
          </form>
        </div>
      </div>
    </main>
  );
}
