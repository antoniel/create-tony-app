import { createFileRoute } from '@tanstack/react-router'
import { DesignSystemPage } from './-design-system'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <DesignSystemPage />
}
