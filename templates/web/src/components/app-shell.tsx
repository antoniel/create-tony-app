import { Box, Flex } from '@chakra-ui/react'
import { useState, type ReactNode } from 'react'
import { AppSidebar } from './app-sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Flex bg="app.bg" bgImage="gradients.chassis"  h="100dvh" overflow="hidden" py="2" pr="2">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <Box
        as="main"
        bg="app.surface"
        borderRadius="2xl"
        flex="1"
        minH="0"
        minW="0"
        overflow="auto"
        shadow="sm"
      >
        {children}
      </Box>
    </Flex>
  )
}
