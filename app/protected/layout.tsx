import { ProtectedLayoutProvider } from "@/app/context/ProtectedLayoutContext";
export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>
  )
}
