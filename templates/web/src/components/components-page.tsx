import { Badge, Button, Code, Container, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'
import { UrlStateExample } from './url-state-example'

const buttonVariants = ['solid', 'subtle', 'outline', 'ghost'] as const

export function ComponentsPage() {
  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack gap="5" maxW="3xl">
          <Badge colorPalette="brand" variant="subtle" w="fit-content">
            ui-02
          </Badge>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="500" lineHeight="0.95">
            Steel fill. Then get out of the way.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Solid is the tool. Outline is a port label. Ghost stays off the plate.
          </Text>
        </Stack>

        <DocsSection
          copy="One dark fill. Everything else is a switch on the case."
          kicker="controls"
          title="Buttons"
        >
          <HStack gap="3" wrap="wrap">
            {buttonVariants.map((variant) => (
              <Button colorPalette="brand" key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </HStack>
        </DocsSection>

        <DocsSection
          copy="Stamped markings. Small, mono, low contrast."
          kicker="controls"
          title="Badges"
        >
          <HStack gap="3" wrap="wrap">
            <Badge colorPalette="brand" variant="solid">
              solid
            </Badge>
            <Badge colorPalette="brand" variant="subtle">
              subtle
            </Badge>
            <Badge colorPalette="brand" variant="outline">
              outline
            </Badge>
          </HStack>
        </DocsSection>

        <DocsSection
          copy="Filters live in the query string, like a layer switch."
          kicker="state"
          title="URL state"
        >
          <Stack gap="3">
            <Text color="fg.muted" fontFamily="mono" fontSize="xs">
              Writes <Code>view</Code> to the URL.
            </Text>
            <UrlStateExample />
          </Stack>
        </DocsSection>
      </Stack>
    </Container>
  )
}
