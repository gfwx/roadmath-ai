"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DialogCloseButton } from "./create-roadmap-dialog"
import { useState } from "react"
import Link from "next/link"

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

  const { roadmaps } = useLayout();
  const currentPath = usePathname();
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
          roadmaps.map((roadmap) => (

            <Link href={`${currentPath}?roadmap=${roadmap.id}`} key={roadmap.id} className="w-full">
              <Button className=' rounded-none w-full flex justify-between' variant="outline">
                <p className='text-sm'>
                  {roadmap.title}
                </p>

                <p className='text-sm text-primary'>
                  {/* @ts-ignore  */}
                  {(roadmap.current_node ?? 0 / roadmap.total_nodes) * 100}%
                </p>
              </Button>
            </Link>

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
