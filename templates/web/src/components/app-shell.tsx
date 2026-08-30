import { Box, Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { chassisImage } from '../theme/build'
import { AppSidebar, useRailCollapsed } from './app-sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useRailCollapsed()

  return (
    <Flex bgColor="app.bg" bgImage={chassisImage} h="100dvh" overflow="hidden" py="2" pr="2">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Box as="main" bg="app.surface" borderRadius="2xl" flex="1" overflow="auto" shadow="sm">
        {children}
      </Box>
    </Flex>
  )
}
