import { Badge, Box, Button, Code, Container, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'
import { UrlStateExample } from './url-state-example'

const buttonVariants = ['solid', 'subtle', 'outline', 'ghost'] as const

export function ComponentsPage() {
  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack gap="4" maxW="2xl">
          <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.16em">
            02
          </Text>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="400" lineHeight="1.05">
            bits
          </Heading>
          <Text color="fg.muted">solid is steel. outline is a port. ghost is off the plate.</Text>
        </Stack>

        <DocsSection copy="one dark fill. the rest is a thinner legend." kicker="ctrl" title="buttons">
          <HStack gap="3" wrap="wrap">
            {buttonVariants.map((variant) => (
              <Button colorPalette="brand" key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </HStack>
          <HStack gap="3" pt="2">
            <Box bg="app.accent" borderRadius="full" boxSize="9" shadow="sm" />
            <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.12em">
              power
            </Text>
          </HStack>
        </DocsSection>

        <DocsSection copy="etched, not stickered." kicker="ctrl" title="marks">
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

        <DocsSection copy="layer switch lives in the query string." kicker="state" title="url">
          <Stack gap="3">
            <Text color="fg.muted" fontFamily="mono" fontSize="xs">
              writes <Code>view</Code>
            </Text>
            <UrlStateExample />
          </Stack>
        </DocsSection>
      </Stack>
    </Container>
  )
}
