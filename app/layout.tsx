import { createClient } from "@/utils/supabase/server";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { headers } from "next/headers"
import ProtectedPathnameWrapper from "@/components/ui/sidebarTriggerWrapper";

import PathnameProvider from "@/utils/pathname_wrapper";
import HeaderAuth from "@/components/header";
import type { Tables } from "@/utils/database.types";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { LayoutProvider } from "./context/LayoutContext";

type User = Tables<"users">
type Roadmap = Tables<"roadmaps">

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
  let h = await headers();
  let pathname = h.get('x-pathname');

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const activeUser = data.user;

  let userData: User | null = null;
  let roadmapsData: Roadmap[] | null = null;

  if (activeUser?.id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", activeUser.id)
      .single();

    if (!error && data) {
      userData = data;
    }
  }

  if (userData?.id) {
    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", userData.id)

    if (!error && data) {
      roadmapsData = data;
    }
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning={true}>
      <body className="bg-background text-foreground">
        <PathnameProvider>
          <LayoutProvider user={userData} roadmaps={roadmapsData}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={true}>
                <ProtectedPathnameWrapper>
                  {userData?.id && <AppSidebar />}
                </ProtectedPathnameWrapper>
                <main className="min-h-screen flex flex-col items-center w-full">
                  <div className="flex-1 w-full flex flex-col gap-20 items-center">
                    <nav className="w-full h-16 flex justify-center border-b border-b-foreground/10 fixed top-0 bg-sidebar left-0 z-50 ">
                      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex justify-center gap-4">
                          <div className="flex gap-5 items-center font-semibold">
                            <Link href={"/"}>roadmath.ai</Link>
                          </div>
                          <ProtectedPathnameWrapper>
                            {userData?.id && <SidebarTrigger />}
                          </ProtectedPathnameWrapper>
                        </div>
                        <HeaderAuth username={userData?.display_name || ""} is_onboarded={userData?.is_onboarded || false} />
                      </div>
                    </nav>
                    <div className="flex flex-col gap-20 max-w-5xl w-full h-full p-5 z-10">
                      {children}
                    </div>
                  </div>
                </main>
              </SidebarProvider>
            </ThemeProvider>
          </LayoutProvider>
        </PathnameProvider>
      </body>
    </html>
  );
}
