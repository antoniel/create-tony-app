import { Box, Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AppSidebar, AppTopBar } from './app-sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Flex bg="app.surface" direction="column" minH="100dvh">
      <AppTopBar />
      <Flex direction={{ base: 'column', md: 'row' }} flex="1" minH="0">
        <AppSidebar />
        <Box as="main" flex="1" minW="0" overflow="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
