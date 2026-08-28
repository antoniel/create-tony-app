import type { QueryClient } from '@tanstack/react-query'
import { Box, Container, Flex, Link as ChakraLink, Text } from '@chakra-ui/react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
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
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Box as="header" borderBottomWidth="1px" borderColor="app.border">
        <Container maxW="6xl" py="4">
          <Flex align="center" justify="space-between">
            <ChakraLink asChild colorPalette="brand" fontWeight="bold">
              <Link to="/">Tony App</Link>
            </ChakraLink>
            <Text color="fg.muted" fontSize="sm">
              Bun · Turborepo · TanStack Start
            </Text>
          </Flex>
        </Container>
      </Box>
      <Outlet />
    </>
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
