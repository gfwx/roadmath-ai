'use client'

import { createContext, useContext } from 'react';
import type { Tables } from "@/utils/database.types"

type Roadmap = Tables<"roadmaps">

const ProtectedLayoutContext = createContext<{ roadmaps: Roadmap[] | null }>({ roadmaps: null });

export const ProtectedLayoutProvider = ({
  roadmaps,
  children
}: {
  roadmaps: Roadmap[] | null,
  children: React.ReactNode
}) => {
  return (
    <ProtectedLayoutContext.Provider value={{ roadmaps }}>
      {children}
    </ProtectedLayoutContext.Provider>
  )
}

export const useProtectedLayout = () => useContext(ProtectedLayoutContext);
