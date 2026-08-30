import { Box, Stack, Text } from '@chakra-ui/react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { PageIntro } from '../../components/docs-section'
import { Code } from '../../components/ui/code'
import { isComponentIndex } from '../../lib/pages'
import { catalogEntry } from './-catalog'

export const Route = createFileRoute('/components/$index')({
  beforeLoad: ({ params }) => {
    if (!isComponentIndex(params.index)) {
      throw redirect({ to: '/components' })
    }
  },
  component: ComponentPage,
})

function ComponentPage() {
  const { index } = Route.useParams()
  if (!isComponentIndex(index)) {
    return null
  }
  const entry = catalogEntry(index)

  return (
    <Stack gap="10">
      <PageIntro spec="ui" title={index.replaceAll('-', ' ')}>
        <Text color="fg.muted">{entry.copy}</Text>
        <Text color="fg.muted" fontFamily="mono" fontSize="xs">
          <Code>src/components/ui/{index}.tsx</Code>
        </Text>
      </PageIntro>
      <Box borderColor="app.border" borderWidth="1px" p={{ base: '6', md: '10' }} shadow="xs">
        {entry.preview}
      </Box>
    </Stack>
  )
}
