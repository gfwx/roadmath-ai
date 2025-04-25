import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FormGenerateWrapper } from "./form-generate-wrapper"
import { createNewRoadmap } from "@/app/actions"
import { DialogCloseButton } from "./create-roadmap-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="flex flex-col items-center text-sm">
        No roadmaps generated.
      </SidebarContent>
      <SidebarFooter>

        <DialogCloseButton />
      </SidebarFooter>
    </Sidebar>
  )
}
