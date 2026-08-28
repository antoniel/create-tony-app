import { Badge, Box, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { UrlStateExample } from '../components/url-state-example'
import { healthService } from '../modules/health'

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(healthService.queryOptions()),
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(healthService.queryOptions())
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
            web → Eden Treaty → API
          </Badge>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} letterSpacing="tight">
            Your Tony App is connected.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            API status: <Text as="strong" color="brand.fg">{data.status}</Text>
          </Text>
          <UrlStateExample />
        </Stack>
      </Box>
    </Container>
  )
}
