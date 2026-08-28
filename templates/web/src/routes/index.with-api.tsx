import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const apiQuery = queryOptions({
  queryKey: ['api-health'],
  queryFn: async () => {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/health`)
    if (!response.ok) throw new Error('API is unavailable')
    return response.json() as Promise<{ status: string }>
  },
})

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(apiQuery),
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(apiQuery)
  return (
    <main>
      <p className="eyebrow">apps/web → apps/api</p>
      <h1>Your Tony App is connected.</h1>
      <p>API status: {data.status}</p>
    </main>
  )
}
