import { Stack } from '@chakra-ui/react'
import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { ComponentCollection } from '../components/catalog-pages'
import { PagePager } from '../components/page-pager'
import { componentPager } from '../lib/pages'

export const Route = createFileRoute('/components')({
  component: ComponentsLayout,
})

function ComponentsLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const detail = pathname.startsWith('/components/') && pathname !== '/components/'

  return detail ? (
    <Stack gap="16">
      <Outlet />
      {PagePager(componentPager)}
    </Stack>
  ) : (
    <ComponentCollection />
  )
}
