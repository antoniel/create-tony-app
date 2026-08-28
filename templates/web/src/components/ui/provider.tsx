import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type { PropsWithChildren } from 'react'
import { system } from '../../theme'

export function Provider({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </ChakraProvider>
  )
}
