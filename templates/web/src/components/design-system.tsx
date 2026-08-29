import { Badge, Box, Code, Container, Flex, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'

const brandScale = [
  ['50', '#f3f3f2'],
  ['100', '#e4e4e2'],
  ['200', '#cfcfcd'],
  ['300', '#b0b0ad'],
  ['400', '#8a8a86'],
  ['500', '#5c5c59'],
  ['600', '#3f3f3c'],
  ['700', '#2a2a28'],
  ['800', '#1a1a18'],
  ['900', '#111110'],
  ['950', '#0a0a09'],
] as const

const semanticColors = [
  { token: 'app.bg', swatch: 'app.bg', note: 'Bench' },
  { token: 'app.surface', swatch: 'app.surface', note: 'Case' },
  { token: 'app.well', swatch: 'app.well', note: 'Faceplate' },
  { token: 'app.border', swatch: 'app.border', note: 'Seam' },
  { token: 'app.accent', swatch: 'app.accent', note: 'Power' },
  { token: 'brand.solid', swatch: 'brand.solid', note: 'Steel' },
] as const

const spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] as const
const typeSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
const radii = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
const shadows = ['xs', 'sm', 'md', 'lg'] as const

export function DesignSystemPage({ status }: { status?: string }) {
  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack gap="5" maxW="3xl">
          <HStack gap="3" wrap="wrap">
            <Badge colorPalette="brand" variant="subtle">
              ds-01
            </Badge>
            {status ? (
              <Badge colorPalette="brand" variant="outline">
                api {status}
              </Badge>
            ) : null}
          </HStack>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="500" lineHeight="0.95">
            Steel. Seam. One light.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Machined case on a bench. Graphite faceplate, hairline joins, orange only where you press.
            Tokens in <Code>apps/web/src/theme/index.ts</Code>.
          </Text>
        </Stack>

        <DocsSection
          copy="Brand is brushed metal. The orange is a separate accent, not a ramp."
          kicker="color"
          title="Brand scale"
        >
          <Grid gap="0" templateColumns="repeat(auto-fill, minmax(7rem, 1fr))">
            {brandScale.map(([step, hex]) => (
              <Stack borderColor="app.border" borderWidth="1px" gap="3" key={step} p="3">
                <Box aspectRatio="1" bg={`brand.${step}`} />
                <Text fontFamily="mono" fontSize="2xs">{`brand.${step}`}</Text>
                <Code fontSize="2xs">{hex}</Code>
              </Stack>
            ))}
          </Grid>
        </DocsSection>

        <DocsSection
          copy="Bench, case, recessed plate. Dark mode keeps the same stack of metals."
          kicker="color"
          title="Semantic surfaces"
        >
          <Grid gap="0" templateColumns="repeat(auto-fill, minmax(14rem, 1fr))">
            {semanticColors.map((color) => (
              <Box borderColor="app.border" borderWidth="1px" key={color.token}>
                <Box bg={color.swatch} borderBottomWidth="1px" borderColor="app.border" h="24" />
                <Stack gap="1" p="4">
                  <Code>{color.token}</Code>
                  <Text color="fg.muted" fontFamily="mono" fontSize="xs">
                    {color.note}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Grid>
        </DocsSection>

        <DocsSection
          copy="Tight pitch. 1 is 4px, 4 is 16px, 8 is 32px."
          kicker="space"
          title="Spacing scale"
        >
          <Stack gap="3">
            {spaces.map((space) => (
              <Flex align="center" gap="4" key={space}>
                <Code minW="10">{space}</Code>
                <Box bg="fg" h="2" w={space} />
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection
          copy="Inter Tight for the case. IBM Plex Mono for stamped markings."
          kicker="type"
          title="Type scale"
        >
          <Stack gap="5">
            {typeSizes.map((size) => (
              <Flex
                align="baseline"
                borderBottomWidth="1px"
                borderColor="app.border"
                gap="6"
                key={size}
                pb="3"
              >
                <Code minW="10">{size}</Code>
                <Text fontSize={size} fontWeight="500" letterSpacing="-0.03em" lineHeight="1">
                  the quick brown fox
                </Text>
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection
          copy="A 6px machine radius. Elevation is a seam or a hairline, not a glow."
          kicker="shape"
          title="Radius and elevation"
        >
          <Grid gap="0" templateColumns="repeat(auto-fill, minmax(10rem, 1fr))">
            {radii.map((radius) => (
              <Box
                borderColor="app.border"
                borderRadius={radius}
                borderWidth="1px"
                key={radius}
                px="4"
                py="10"
                textAlign="center"
              >
                <Code>{radius}</Code>
              </Box>
            ))}
          </Grid>
          <Grid gap="0" templateColumns="repeat(auto-fill, minmax(10rem, 1fr))">
            {shadows.map((shadow) => (
              <Box
                borderColor="app.border"
                borderWidth="1px"
                key={shadow}
                px="4"
                py="10"
                shadow={shadow}
                textAlign="center"
              >
                <Code>{shadow}</Code>
              </Box>
            ))}
          </Grid>
        </DocsSection>
      </Stack>
    </Container>
  )
}
