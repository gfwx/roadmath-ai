"use client"
import { DashboardComponent } from "@/components/dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { useLayout } from "@/app/context/LayoutContext";
import { useEffect } from "react";
import type { Tables } from "@/utils/database.types";
type Roadmap = Tables<"roadmaps">

export default function ProtectedPage() {
  let roadmapData: Roadmap[] | null = useLayout().roadmaps;
  return (
    <DashboardComponent roadmapData={roadmapData} />
  );
}
