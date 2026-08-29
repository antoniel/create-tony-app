import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type { PropsWithChildren } from 'react'
import { ThemeStudioProvider } from '../../theme/studio'

export function Provider({ children }: PropsWithChildren) {
  return (
    <ThemeStudioProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </ThemeStudioProvider>
  )
}
