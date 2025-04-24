import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/components/header";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import type { Tables } from "@/utils/database.types";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import Link from "next/link";
import "./globals.css";
import { LayoutProvider } from "./context/LayoutContext";

type User = Tables<"users">

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Roadmath.ai",
  description: "Hackathon project submission",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let userData: User | null = null;

  if (session?.user?.id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!error && data) {
      userData = data;
    }
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning={true}>
      <body className="bg-background text-foreground">
        <LayoutProvider user={userData}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={"/"}>roadmath.ai</Link>
                    </div>
                    <HeaderAuth username={userData?.username || ""} is_onboarded={userData?.is_onboarded || false} />
                  </div>
                </nav>
                <div className="flex flex-col gap-20 max-w-5xl p-5">
                  {children}
                </div>
              </div>
            </main>
          </ThemeProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
