// context/LayoutContext.tsx
'use client'

import { createContext, useContext } from 'react'
import type { Tables } from '@/utils/database.types'

type User = Tables<'users'>

const LayoutContext = createContext<{ user: User | null }>({ user: null })

export const LayoutProvider = ({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) => {
  return (
    <LayoutContext.Provider value={{ user }}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
