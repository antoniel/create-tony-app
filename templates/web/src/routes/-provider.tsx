import { DesignProvider } from '../studio/design-provider'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type { PropsWithChildren } from 'react'
import { Toaster } from '../components/ui/toaster'

export function Provider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DesignProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </DesignProvider>
    </ThemeProvider>
  )
}
