import { Badge, Box, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { UrlStateExample } from '../components/url-state-example'

const welcomeQuery = queryOptions({
  queryKey: ['welcome'],
  queryFn: async () => ({ message: 'Your TanStack Start app is ready.' }),
})

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(welcomeQuery),
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(welcomeQuery)
  return (
    <Container maxW="6xl" py={{ base: '20', md: '32' }}>
      <Box
        bg="app.surface"
        borderColor="app.border"
        borderRadius="2xl"
        borderWidth="1px"
        maxW="3xl"
        p={{ base: '8', md: '12' }}
        shadow="sm"
      >
        <Stack align="start" gap="6">
          <Badge colorPalette="brand" variant="subtle">
            apps/web
          </Badge>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} letterSpacing="tight">
            {data.message}
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            File-based routing, React Query, Chakra UI, theming, and nuqs are configured.
          </Text>
          <UrlStateExample />
        </Stack>
      </Box>
    </Container>
  )
}
