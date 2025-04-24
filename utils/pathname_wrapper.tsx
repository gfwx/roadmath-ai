// app/ClientLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const PathnameContext = createContext<string | null>(null);
export const usePath = () => useContext(PathnameContext);

export default function PathnameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <PathnameContext.Provider value={currentPath}>
      {children}
    </PathnameContext.Provider>
  )
}
