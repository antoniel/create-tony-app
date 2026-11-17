import { Box, Grid, Stack, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { componentPages, componentTo, type ComponentIndex } from '../lib/pages'
import { catalogEntry, catalogPreview } from '../routes/components/-catalog'
import { PageIntro } from './docs-section'
import { Code } from './ui/code'

export function ComponentCollection({ sourceRoot = 'src' }: { sourceRoot?: string }) {
  return (
    <Stack gap="16">
      <PageIntro spec="01" title="components">
        <Text color="fg.muted">
          one file in{' '}
          <Text as="span" fontFamily="mono">
            {sourceRoot}/components/ui
          </Text>
          . the look lives there.
        </Text>
      </PageIntro>
      <Grid gap="0" templateColumns="repeat(auto-fill, minmax(16rem, 1fr))">
        {componentPages.map((page) => (
          <Stack
            key={page.index}
            borderColor="app.border"
            borderWidth="1px"
            gap="4"
            h="full"
            p="4"
            shadow="xs"
            _hover={{ bg: 'app.spot' }}
          >
            <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
              {page.spec}
            </Text>
            <BoxPreview>{catalogPreview(page.index)}</BoxPreview>
            <Link params={componentTo(page.index).params} to="/components/$index">
              <Text fontSize="sm" letterSpacing="tight">
                {page.label} ↗
              </Text>
            </Link>
          </Stack>
        ))}
      </Grid>
    </Stack>
  )
}

export function ComponentDetail({
  index,
  sourceRoot = 'src',
}: {
  index: ComponentIndex
  sourceRoot?: string
}) {
  const entry = catalogEntry(index)

  return (
    <Stack gap="10">
      <PageIntro spec="ui" title={index.replaceAll('-', ' ')}>
        <Text color="fg.muted">{entry.copy}</Text>
        <Text color="fg.muted" fontFamily="mono" fontSize="xs">
          <Code>
            {sourceRoot}/components/ui/{index}.tsx
          </Code>
        </Text>
      </PageIntro>
      <Box borderColor="app.border" borderWidth="1px" p={{ base: '6', md: '10' }} shadow="xs">
        {entry.preview}
      </Box>
    </Stack>
  )
}

function BoxPreview({ children }: { children: ReactNode }) {
  return (
    <Stack
      align="center"
      bg="app.bg"
      borderColor="app.border"
      borderWidth="1px"
      h="36"
      justify="center"
      overflow="hidden"
      pointerEvents="none"
      inert
      px="4"
    >
      {children}
    </Stack>
  )
}
