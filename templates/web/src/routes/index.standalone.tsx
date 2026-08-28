import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

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
    <main>
      <p className="eyebrow">apps/web</p>
      <h1>{data.message}</h1>
      <p>File-based routing and React Query are configured.</p>
    </main>
  )
}
