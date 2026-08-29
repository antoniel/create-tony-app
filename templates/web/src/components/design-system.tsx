import { Badge, Box, Code, Container, Flex, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'

const brandScale = [
  ['50', '#f6f6f6'],
  ['100', '#e8e8e8'],
  ['200', '#d2d2d2'],
  ['300', '#b0b0b0'],
  ['400', '#7a7a7a'],
  ['500', '#2a2a2a'],
  ['600', '#1a1a1a'],
  ['700', '#111111'],
  ['800', '#0a0a0a'],
  ['900', '#050505'],
  ['950', '#000000'],
] as const

const semanticColors = [
  { token: 'app.bg', swatch: 'app.bg', note: 'Floor' },
  { token: 'app.surface', swatch: 'app.surface', note: 'Tile / card' },
  { token: 'app.border', swatch: 'app.border', note: 'Join' },
  { token: 'brand.solid', swatch: 'brand.solid', note: 'Buy / primary' },
  { token: 'brand.fg', swatch: 'brand.fg', note: 'Ink' },
  { token: 'brand.subtle', swatch: 'brand.subtle', note: 'Hover bed' },
] as const

const spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] as const
const typeSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
const radii = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
const shadows = ['xs', 'sm', 'md', 'lg'] as const

export function DesignSystemPage({ status }: { status?: string }) {
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
          <HStack gap="3" wrap="wrap">
            <Badge colorPalette="brand" variant="subtle">
              SKU / DS-01
            </Badge>
            {status ? (
              <Badge colorPalette="brand" variant="outline">
                API {status}
              </Badge>
            ) : null}
          </HStack>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="500" lineHeight="0.95">
            Blocks. Price. Nothing else.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Clean brutalism for a storefront that reads like a dashboard. Black CTA, square tiles,
            mono SKUs. Tokens in <Code>apps/web/src/theme/index.ts</Code>.
          </Text>
        </Stack>

        <DocsSection
          copy="Ink, not color. Brand is a gray ramp so the product stays the loudest object on the page."
          kicker="Color"
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
          copy="White tiles on a gray floor. Dark mode inverts the chassis. Borders are joins, not frames."
          kicker="Color"
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
          copy="Dashboard density with e-comm air. 1 is 4px, 4 is 16px, 8 is 32px."
          kicker="Space"
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
          copy="Inter Tight for UI and titles. IBM Plex Mono for SKUs, indexes, and readouts."
          kicker="Type"
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
                  The quick brown fox
                </Text>
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection
          copy="Zero radius. Zero shadow. A 1px join is the only edge."
          kicker="Shape"
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
