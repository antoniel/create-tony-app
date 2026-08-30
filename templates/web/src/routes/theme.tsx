import { Button, Code, Flex, Stack, Text } from '@chakra-ui/react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { PageIntro } from '../components/docs-section'
import { PagePager } from '../components/page-pager'
import { themePager } from '../lib/pages'
import { useThemeStudio } from '../theme/studio'

export const Route = createFileRoute('/theme')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/theme' || location.pathname === '/theme/') {
      throw redirect({ to: '/theme/$index', params: { index: 'seed' } })
    }
  },
  component: ThemeLayout,
})

function ThemeLayout() {
  const { source, reset } = useThemeStudio()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <Stack gap="16">
        <PageIntro maxW="3xl" spec="05" title="tune">
          <Text color="fg.muted">
            rebuilds the system live. copy into <Code>apps/web/src/theme/index.ts</Code>
          </Text>
          <Flex gap="3" wrap="wrap">
            <Button colorPalette="brand" onClick={copy} variant="solid">
              {copied ? 'Copied' : 'Copy theme file'}
            </Button>
            <Button colorPalette="brand" onClick={reset} variant="outline">
              Reset
            </Button>
          </Flex>
        </PageIntro>
        <Outlet />
        {PagePager(themePager)}
      </Stack>
    </>
  )
}
