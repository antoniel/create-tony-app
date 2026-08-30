import { Grid, Stack, Text } from '@chakra-ui/react'
import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PageIntro } from '../components/docs-section'
import { PagePager } from '../components/page-pager'
import { componentPages, componentPager, componentTo } from '../lib/pages'
import { catalogPreview } from './components/-catalog'

export const Route = createFileRoute('/components')({
  component: ComponentsLayout,
})

function ComponentsLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const detail = pathname.startsWith('/components/') && pathname !== '/components/'

  if (detail) {
    return (
      <Stack gap="16">
        <Outlet />
        {PagePager(componentPager)}
      </Stack>
    )
  }

  return (
    <Stack gap="16">
      <PageIntro spec="01" title="components">
        <Text color="fg.muted">
          one file in <Text as="span" fontFamily="mono">src/components/ui</Text>. the look lives
          there.
        </Text>
      </PageIntro>
      <Grid gap="0" templateColumns="repeat(auto-fill, minmax(16rem, 1fr))">
        {componentPages.map((page) => (
          <Link key={page.index} params={componentTo(page.index).params} to="/components/$index">
            <Stack
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
              <Text fontSize="sm" letterSpacing="tight">
                {page.label}
              </Text>
            </Stack>
          </Link>
        ))}
      </Grid>
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
      px="4"
    >
      {children}
    </Stack>
  )
}
