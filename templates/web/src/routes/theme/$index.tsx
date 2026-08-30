import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  ThemeFilePage,
  ThemeFontsPage,
  ThemeSeedPage,
  ThemeSurfacesPage,
} from './-pages'
import { isThemeIndex } from '../../lib/pages'

export const Route = createFileRoute('/theme/$index')({
  beforeLoad: ({ params }) => {
    if (!isThemeIndex(params.index)) {
      throw redirect({ to: '/theme/$index', params: { index: 'seed' } })
    }
  },
  component: ThemeIndex,
})

function ThemeIndex() {
  const { index } = Route.useParams()
  if (index === 'surfaces') {
    return <ThemeSurfacesPage />
  }
  if (index === 'fonts') {
    return <ThemeFontsPage />
  }
  if (index === 'file') {
    return <ThemeFilePage />
  }
  return <ThemeSeedPage />
}
