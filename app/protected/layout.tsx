import { ProtectedLayoutProvider } from "@/app/context/ProtectedLayoutContext";
import { fetchRoadmaps } from "@/app/actions";
export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>
  )
}
