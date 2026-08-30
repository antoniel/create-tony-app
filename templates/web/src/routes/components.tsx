import { Stack, Text } from '@chakra-ui/react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { PageIntro } from '../components/docs-section'
import { PagePager } from '../components/page-pager'
import { componentPager } from '../lib/pages'

export const Route = createFileRoute('/components')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/components' || location.pathname === '/components/') {
      throw redirect({ to: '/components/$index', params: { index: 'buttons' } })
    }
  },
  component: ComponentsLayout,
})

function ComponentsLayout() {
  return (
    <>
      <Stack gap="16">
        <PageIntro spec="02" title="bits">
          <Text color="fg.muted">solid is steel. outline is a port. that is the set.</Text>
        </PageIntro>
        <Outlet />
        {PagePager(componentPager)}
      </Stack>
    </>
  )
}
