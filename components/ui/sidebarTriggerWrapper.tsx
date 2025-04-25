"use client"
import { SidebarTrigger } from "./sidebar";
import { usePath } from "@/utils/pathname_wrapper"

export default function ProtectedPathnameWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePath();
  return (
    <div>
      {pathname && pathname.startsWith('/protected') ? children : null}
    </div>
  );
}
