import { Box, Flex } from '@chakra-ui/react'
import { useState, type ReactNode } from 'react'
import { AppSidebar } from './app-sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Flex
      bg="app.bg"
      bgImage={{
        _light: 'linear-gradient(165deg, #eef1f3 0%, #c5cad0 48%, #b3b8be 100%)',
        _dark: 'linear-gradient(165deg, #3a3f44 0%, #2a2e32 52%, #1c1f22 100%)',
      }}
      gap="2"
      h="100dvh"
      overflow="hidden"
      p="2"
    >
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
