import { Badge, Box, Button, Code, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection, PageFrame, PageIntro } from './docs-section'
import { UrlStateExample } from './url-state-example'

const buttonVariants = ['solid', 'outline'] as const

export function ComponentsPage() {
  return (
    <PageFrame>
      <Stack gap="16">
        <PageIntro spec="02" title="bits">
          <Text color="fg.muted">solid is steel. outline is a port. that is the set.</Text>
        </PageIntro>

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

        <DocsSection copy="layer switch lives in the query string." kicker="state" title="url">
          <Stack gap="3">
            <Text color="fg.muted" fontFamily="mono" fontSize="xs">
              writes <Code>view</Code>
            </Text>
            <UrlStateExample />
          </Stack>
        </DocsSection>
      </Stack>
    </PageFrame>
  )
}
