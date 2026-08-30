import { Badge, Box, Button, Code, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from '../../components/docs-section'
import { UrlStateExample } from './-url-state'

const buttonVariants = ['solid', 'outline'] as const

export function ButtonsPage() {
  return (
    <DocsSection
      copy="two fills. solid does the work. outline marks a port."
      kicker="ctrl"
      title="buttons"
    >
      <HStack gap="3" wrap="wrap">
        {buttonVariants.map((variant) => (
          <Button colorPalette="brand" key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </HStack>
      <HStack gap="3" pt="2">
        <Box bg="app.accent" borderRadius="full" boxSize="9" shadow="sm" />
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
          power
        </Text>
      </HStack>
    </DocsSection>
  )
}

export function MarksPage() {
  return (
    <DocsSection copy="etched, not stickered." kicker="ctrl" title="marks">
      <HStack gap="3" wrap="wrap">
        <Badge colorPalette="brand" variant="solid">
          solid
        </Badge>
        <Badge colorPalette="brand" variant="outline">
          outline
        </Badge>
      </HStack>
    </DocsSection>
  )
}

export function UrlPage() {
  return (
    <DocsSection copy="layer switch lives in the query string." kicker="state" title="url">
      <Stack gap="3">
        <Text color="fg.muted" fontFamily="mono" fontSize="xs">
          writes <Code>view</Code>
        </Text>
        <UrlStateExample />
      </Stack>
    </DocsSection>
  )
}
