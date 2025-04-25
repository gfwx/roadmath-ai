import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 items-center h-full">
        <section className="flex flex-col gap-2 items-center justify-center pt-16">
          <h1 className="text-3xl font-bold">It's NotebookLM on Steroids.</h1>
          <h2 className="text-xl font-semibold">Not kidding.</h2>
        </section>
      </main>
    </>
  );
}
