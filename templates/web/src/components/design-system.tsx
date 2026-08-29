import { Box, Code, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { DocsSection } from './docs-section'

const brandScale = [
  ['50', '#f7f8f9'],
  ['100', '#eef0f2'],
  ['200', '#d4d8dc'],
  ['300', '#b4bac0'],
  ['400', '#8f969e'],
  ['500', '#6f777f'],
  ['600', '#565d64'],
  ['700', '#3f4449'],
  ['800', '#2a2e32'],
  ['900', '#181b1e'],
  ['950', '#0c0e10'],
] as const

const semanticColors = [
  { token: 'app.bg', swatch: 'app.bg', note: 'chassis' },
  { token: 'app.surface', swatch: 'app.surface', note: 'plate' },
  { token: 'app.well', swatch: 'app.well', note: 'slot' },
  { token: 'app.border', swatch: 'app.border', note: 'seam' },
  { token: 'app.accent', swatch: 'app.accent', note: 'power' },
  { token: 'brand.solid', swatch: 'brand.solid', note: 'steel' },
] as const

const spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] as const
const typeSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
const radii = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
const shadows = ['xs', 'sm', 'md', 'lg'] as const

export function DesignSystemPage({ status }: { status?: string }) {
  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack gap="4" maxW="2xl">
          <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.16em">
            01{status ? `  ·  ${status}` : ''}
          </Text>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="400" lineHeight="1.05">
            LM 5–180
          </Heading>
          <Text color="fg.muted">
            titanium chassis, white insert. tokens in <Code>apps/web/src/theme/index.ts</Code>
          </Text>
        </Stack>

        <DocsSection
          copy="titanium ramp. orange is a control, not a scale."
          kicker="color"
          title="brand"
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

        <DocsSection copy="same stack in dark. value, not hue." kicker="color" title="surfaces">
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

        <DocsSection copy="1 = 4px. 4 = 16px. 8 = 32px." kicker="space" title="pitch">
          <Stack gap="3">
            {spaces.map((space) => (
              <Flex align="center" gap="4" key={space}>
                <Code minW="10">{space}</Code>
                <Box bg="fg" h="px" w={space} />
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection copy="inter for the plate. plex mono for the etch." kicker="type" title="legend">
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
                <Text fontSize={size} fontWeight="400" letterSpacing="-0.02em" lineHeight="1">
                  the quick brown fox
                </Text>
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection copy="4px machine edge. elevation is a seam or an inset." kicker="shape" title="edge">
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
