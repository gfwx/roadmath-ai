import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
