import type { QueryClient } from '@tanstack/react-query'
import { Box, Flex } from '@chakra-ui/react'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { AppSidebar } from '../components/app-sidebar'
import { Provider } from '../components/ui/provider'

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
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} minH="100dvh">
      <AppSidebar />
      <Box as="main" flex="1" minW="0">
        <Outlet />
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
        <Scripts />
      </body>
    </html>
  )
}
