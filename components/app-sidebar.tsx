"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DialogCloseButton } from "./create-roadmap-dialog"
import { useRoadmapStore } from "@/app/stores/store"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { useLayout } from "@/app/context/LayoutContext"

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const { roadmaps } = useLayout();
  const roadmapStore = useRoadmapStore();

  const selectRoadmapHandler = (roadmapId: string) => {
    // Implement your logic here to select the roadmap
    if (roadmaps) {
      const selectedRoadmap = roadmaps.find((r) => r.id === roadmapId);
      if (selectedRoadmap == undefined) {
        throw new Error("Somehow, the roadmap doesn't exist, despite rendering it. What black magic sorcery are have you been up to?")
      }
      roadmapStore.setRoadmap(selectedRoadmap);
      router.push(`/protected?roadmap=${roadmapId}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <p className='text-md text-primary font-black pt-4 self-center justify-self-center'>
          Active Roadmaps
        </p>
        <Separator className='my-4' />
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center text-sm px-2">
        {roadmaps ?
          roadmaps.map((roadmap) => (

            <Button key={roadmap.id} className=' rounded-none w-full flex justify-between' variant="outline" onClick={() => selectRoadmapHandler(roadmap.id)}>
              <p className='text-sm'>
                {roadmap.title}
              </p>

              <p className='text-sm text-primary'>
                {/* @ts-ignore  */}
                {(roadmap.current_node ?? 0 / roadmap.total_nodes) * 100}%
              </p>
            </Button>

          ))
          :
          <div>No roadmaps</div>
        }
      </SidebarContent>
      <SidebarFooter>
        <DialogCloseButton />
      </SidebarFooter>
    </Sidebar>
  )
}
