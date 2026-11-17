import { Box, Container, Flex } from '@chakra-ui/react'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { Mesurer } from 'mesurer'
import '../mesurer.css'
import { chassisImage } from '../theme/build'
import { AppSidebar, useRailCollapsed } from './-app-sidebar'
import { Provider } from './-provider'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Tony App' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:ital,wght@0,400;0,500;1,400&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  const studio = useRouterState({ select: (state) => state.location.pathname.replace(/\/$/, '') === '/studio' })
  const [collapsed, setCollapsed] = useRailCollapsed()
  return (
    <Flex bgColor="app.bg" bgImage={chassisImage} h="100dvh" overflow="hidden" py="2" pr="2">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Box as="main" bg="app.surface" borderRadius="2xl" flex="1" minW="0" overflow="auto" shadow="sm">
        {studio ? <Outlet /> : <Container maxW="6xl" mx="auto" pb={{ base: '10', md: '16' }} pt="2" px="4">
          <Outlet />
        </Container>}
      </Box>
    </Flex>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Provider>{children}</Provider>
        {import.meta.env.DEV && <DevelopmentMeasure />}
        <Scripts />
      </body>
    </html>
  )
}

function DevelopmentMeasure() {
  const studio = useRouterState({ select: (state) => state.location.pathname.replace(/\/$/, '') === '/studio' })
  return studio ? null : <Mesurer />
}
