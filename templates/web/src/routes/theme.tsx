import { createFileRoute } from '@tanstack/react-router'
import { ThemeEditorPage } from '../components/theme-editor-page'

export const Route = createFileRoute('/theme')({
  component: ThemeRoute,
})

function ThemeRoute() {
  return <ThemeEditorPage />
}
