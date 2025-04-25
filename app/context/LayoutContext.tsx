// context/LayoutContext.tsx
'use client'

import { createContext, useContext } from 'react'
import type { Tables } from '@/utils/database.types'

type User = Tables<'users'>
type Roadmap = Tables<'roadmaps'>

const LayoutContext = createContext<{ user: User | null, roadmaps: Roadmap[] | null }>({ user: null, roadmaps: null })

export const LayoutProvider = ({
  user,
  roadmaps,
  children,
}: {
  user: User | null
  roadmaps: Roadmap[] | null
  children: React.ReactNode
}) => {
  return (
    <LayoutContext.Provider value={{ user, roadmaps }}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
