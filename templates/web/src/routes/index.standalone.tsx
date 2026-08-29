import { createFileRoute } from '@tanstack/react-router'
import { DesignSystemPage } from '../components/design-system'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <DesignSystemPage />
}
