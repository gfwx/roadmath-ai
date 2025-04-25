"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DialogCloseButton } from "./create-roadmap-dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { useLayout } from "@/app/context/LayoutContext"

export function AppSidebar() {
  const { roadmaps } = useLayout();
  return (
    <Sidebar>
      <SidebarHeader>
        <p className='text-sm font-mono text-primary text-bold self-center justify-self-center'>
          Active Roadmaps
        </p>
        <Separator className='my-4' />
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center text-sm px-2">
        {roadmaps ?
          <Button className='w-full rounded-none flex justify-between' variant="outline">
            <p className='text-sm'>
              {roadmaps[0].title}
            </p>

            <p className='text-sm text-primary'>
              {roadmaps[0].total_nodes}%
            </p>
          </Button>
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
