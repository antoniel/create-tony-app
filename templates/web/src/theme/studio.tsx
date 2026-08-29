import { ChakraProvider } from '@chakra-ui/react'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildSystem, themeSource } from './build'
import { defaultDraft, type ThemeDraft } from './draft'

interface ThemeStudioValue {
  draft: ThemeDraft
  source: string
  setDraft: (next: ThemeDraft | ((current: ThemeDraft) => ThemeDraft)) => void
  reset: () => void
}

const ThemeStudioContext = createContext<ThemeStudioValue | null>(null)

export function ThemeStudioProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(defaultDraft)
  const system = useMemo(() => buildSystem(draft), [draft])
  const source = useMemo(() => themeSource(draft), [draft])

  useEffect(() => {
    setDraft(defaultDraft)
  }, [defaultDraft])

  return (
    <ThemeStudioContext.Provider
      value={{ draft, source, setDraft, reset: () => setDraft(defaultDraft) }}
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeStudioContext.Provider>
  )
}

export function useThemeStudio() {
  const value = useContext(ThemeStudioContext)
  if (!value) {
    throw new Error('useThemeStudio must be used inside ThemeStudioProvider')
  }
  return value
}
