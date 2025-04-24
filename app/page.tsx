import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <header className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl font-bold">It's NotebookLM on Steroids.</h1>
          <h2 className="text-xl font-semibold">Not kidding.</h2>
        </header>
      </main>
    </>
  );
}
