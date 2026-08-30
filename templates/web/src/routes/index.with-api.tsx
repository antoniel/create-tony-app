import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { healthService } from '../modules/health'
import { DesignSystemPage } from './-design-system'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(healthService.queryOptions()),
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(healthService.queryOptions())
  return <DesignSystemPage status={data.status} />
}
