import { createFileRoute, redirect } from '@tanstack/react-router'
import { ComponentDetail } from '../../components/catalog-pages'
import { isComponentIndex } from '../../lib/pages'

export const Route = createFileRoute('/components/$index')({
  beforeLoad: ({ params }) => {
    if (!isComponentIndex(params.index)) {
      throw redirect({ to: '/components' })
    }
  },
  component: ComponentPage,
})

function ComponentPage() {
  const { index } = Route.useParams()
  return isComponentIndex(index) ? <ComponentDetail index={index} /> : null
}
