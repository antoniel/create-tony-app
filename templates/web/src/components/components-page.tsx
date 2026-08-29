import { Badge, Button, Code, Container, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'
import { UrlStateExample } from './url-state-example'

const buttonVariants = ['solid', 'subtle', 'outline', 'ghost'] as const

export function ComponentsPage() {
  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack
          borderBottomWidth="1px"
          borderColor="app.border"
          gap="5"
          maxW="3xl"
          pb="10"
        >
          <Badge colorPalette="brand" variant="subtle" w="fit-content">
            SKU / UI-02
          </Badge>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="500" lineHeight="0.95">
            Add to bag. Or don’t.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Solid is checkout. Outline is a filter. Ghost stays out of the way.
          </Text>
        </Stack>

        <DocsSection
          copy="One black fill. Everything else is a switch on the tile."
          kicker="Controls"
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
          copy="SKU marks and stock states. Keep them small and mono."
          kicker="Controls"
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
          copy="Filters and views belong in the query string, like a catalog URL."
          kicker="State"
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
