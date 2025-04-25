import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { createNewRoadmap } from "@/app/actions";
import { FormGenerateWrapper } from "@/components/form-generate-wrapper";

export function DashboardComponent() {
  return (
    <main className="flex flex-col min-w-64  mx-auto pt-16 w-full h-full">
      <div className="flex flex-col gap-2 relative bottom-0 mt-32 items-center w-full">
        <h1 className="text-2xl font-bold self-center">Create a new roadmap</h1>
        <div className="flex gap-4 items-stretch h-12 w-full max-w-screen-md">
          <Textarea className="resize-none w-full h-full" placeholder="What's relentlessly bogging your mind?" />
          <FormGenerateWrapper>
            <SubmitButton pendingText="Waiting.." formAction={createNewRoadmap} className="h-full"> Send </SubmitButton>
          </FormGenerateWrapper>
        </div>
      </div>
    </main>
  );
}
