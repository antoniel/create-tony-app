import { createFileRoute } from '@tanstack/react-router'
import { ComponentsPage } from '../components/components-page'

export const Route = createFileRoute('/components')({
  component: ComponentsRoute,
})

function ComponentsRoute() {
  return <ComponentsPage />
}
