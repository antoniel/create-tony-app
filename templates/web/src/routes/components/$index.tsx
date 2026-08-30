import { createFileRoute, redirect } from '@tanstack/react-router'
import { ButtonsPage, MarksPage, UrlPage } from './-pages'
import { isComponentIndex } from '../../lib/pages'

export const Route = createFileRoute('/components/$index')({
  beforeLoad: ({ params }) => {
    if (!isComponentIndex(params.index)) {
      throw redirect({ to: '/components/$index', params: { index: 'buttons' } })
    }
  },
  component: ComponentsIndex,
})

function ComponentsIndex() {
  const { index } = Route.useParams()
  if (index === 'marks') {
    return <MarksPage />
  }
  if (index === 'url') {
    return <UrlPage />
  }
  return <ButtonsPage />
}
