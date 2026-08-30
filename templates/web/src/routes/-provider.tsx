import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type { PropsWithChildren } from 'react'
import { Toaster } from '../components/ui/toaster'
import { system } from '../theme'

export function Provider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ChakraProvider value={system}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </ChakraProvider>
    </ThemeProvider>
  )
}
