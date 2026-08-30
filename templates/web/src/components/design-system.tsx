import { Box, Code, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { CaretRight, Cube, Faders, Plugs, StackSimple, Swatches } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { brandSteps, defaultDraft } from '../theme/draft'
import { DocsSection, PageFrame, PageIntro } from './docs-section'
import { navMarks, navRowProps, useNavMark, type NavMark } from './nav-mark'

const brandScale = brandSteps.map((step) => [step, defaultDraft.brand[step]] as const)

const semanticColors = [
  { token: 'app.bg', swatch: 'app.bg', note: 'chassis' },
  { token: 'app.surface', swatch: 'app.surface', note: 'plate' },
  { token: 'app.well', swatch: 'app.well', note: 'slot' },
  { token: 'app.border', swatch: 'app.border', note: 'hairline' },
  { token: 'app.highlight', swatch: 'app.highlight', note: 'catch' },
  { token: 'app.recess', swatch: 'app.recess', note: 'shade' },
  { token: 'app.focus', swatch: 'app.focus', note: 'tab' },
  { token: 'app.spot', swatch: 'app.spot', note: 'hit' },
  { token: 'app.accent', swatch: 'app.accent', note: 'power' },
  { token: 'brand.solid', swatch: 'brand.solid', note: 'steel' },
] as const

const spaces = [
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '12',
  '14',
  '16',
  '20',
  '24',
] as const
const typeRoles = [
  { size: '2xs', note: 'etch' },
  { size: 'sm', note: 'ctrl' },
  { size: 'md', note: 'copy' },
  { size: '4xl', note: 'plate' },
] as const
const edges = [
  { token: 'sm', note: 'edge · 4px' },
  { token: 'md', note: 'control · 8px' },
  { token: '2xl', note: 'plate · 24px' },
] as const

export function DesignSystemPage({ status }: { status?: string }) {
  return (
    <PageFrame>
      <Stack gap="16">
        <PageIntro spec={`01${status ? `  ·  ${status}` : ''}`} title="LM 5–180">
          <Text color="fg.muted">
            titanium chassis, white insert. tokens in <Code>apps/web/src/theme/index.ts</Code>
          </Text>
        </PageIntro>

        <DocsSection
          copy="titanium ramp. orange is a control, not a scale."
          kicker="color"
          title="brand"
        >
          <Grid gap="0" templateColumns="repeat(auto-fill, minmax(7rem, 1fr))">
            {brandScale.map(([step, hex]) => (
              <Stack
                borderColor="app.border"
                borderWidth="1px"
                gap="3"
                key={step}
                p="3"
                shadow="xs"
              >
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
              <Box borderColor="app.border" borderWidth="1px" key={color.token} shadow="xs">
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

        <DocsSection copy="1 = 4px. the whole ladder stays." kicker="space" title="pitch">
          <Stack gap="3">
            {spaces.map((space) => (
              <Flex align="center" gap="4" key={space}>
                <Code minW="10">{space}</Code>
                <Box bg="fg" h="px" w={space} />
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <DocsSection
          copy="inter on the plate. plex mono on the etch. four sizes."
          kicker="type"
          title="legend"
        >
          <Stack gap="5">
            {typeRoles.map((role) => (
              <Flex
                align="baseline"
                borderBottomWidth="1px"
                borderColor="app.border"
                gap="6"
                key={role.size}
                pb="3"
              >
                <Code minW="10">{role.size}</Code>
                <Text
                  fontSize={role.size}
                  fontWeight="normal"
                  letterSpacing="tight"
                  lineHeight="none"
                >
                  the quick brown fox
                </Text>
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
                  {role.note}
                </Text>
              </Flex>
            ))}
          </Stack>
        </DocsSection>

        <NavMarkSection />

        <DocsSection copy="4, 8, 24. that is the set." kicker="shape" title="edge">
          <Grid gap="6" templateColumns="repeat(auto-fill, minmax(14rem, 1fr))">
            {edges.map((edge) => (
              <Box
                borderColor="app.border"
                borderRadius={edge.token}
                borderWidth="1px"
                key={edge.token}
                shadow="xs"
                px="4"
                py="10"
              >
                <Code>{edge.token}</Code>
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide" pt="2">
                  {edge.note}
                </Text>
              </Box>
            ))}
          </Grid>
        </DocsSection>
      </Stack>
    </PageFrame>
  )
}

const previewTree = [
  {
    label: 'plate',
    icon: StackSimple,
    items: [{ label: 'system', spec: '01', icon: Swatches }],
  },
  {
    label: 'port',
    icon: Plugs,
    items: [
      { label: 'bits', spec: '02', icon: Cube },
      { label: 'tune', spec: '03', icon: Faders },
    ],
  },
] as const

function NavMarkSection() {
  const [mark, setMark] = useNavMark()
  const [picked, setPicked] = useState('system')

  return (
    <DocsSection
      copy="three marks. hover and click a child. the live rail follows the one you pick."
      kicker="nav"
      title="submenu"
    >
      <Grid gap="6" templateColumns="repeat(auto-fill, minmax(16rem, 1fr))">
        {navMarks.map((option) => {
          const active = mark === option.id
          return (
            <Stack
              bg={active ? 'app.spot' : 'transparent'}
              borderColor={active ? 'app.focus' : 'app.border'}
              borderWidth="1px"
              gap="4"
              key={option.id}
              p="3"
              shadow="xs"
            >
              <Stack
                as="button"
                cursor="pointer"
                gap="1"
                textAlign="left"
                type="button"
                onClick={() => setMark(option.id)}
              >
                <Text fontFamily="mono" fontSize="2xs" letterSpacing="wide">
                  {option.title}
                  {active ? '  ·  on' : ''}
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  {option.copy}
                </Text>
              </Stack>
              <MarkPreview
                mark={option.id}
                picked={picked}
                onPick={(label) => {
                  setPicked(label)
                  setMark(option.id)
                }}
              />
            </Stack>
          )
        })}
      </Grid>
    </DocsSection>
  )
}

function MarkPreview({
  mark,
  picked,
  onPick,
}: {
  mark: NavMark
  picked: string
  onPick: (label: string) => void
}) {
  return (
    <Stack bg="app.bg" borderColor="app.border" borderWidth="1px" gap="0" py="2">
      {previewTree.map((group) => {
        const inherited = group.items.some((item) => item.label === picked)
        return (
          <Stack gap="0" key={group.label}>
            <Flex align="center" gap="2" h="8" px="3" {...navRowProps(mark, false, inherited)}>
              <Flex h="8" placeContent="center" placeItems="center" w="8">
                <group.icon size={16} weight="light" />
              </Flex>
              <Text flex="1" fontSize="sm">
                {group.label}
              </Text>
              <CaretRight size={12} weight="light" />
            </Flex>
            <Stack
              alignSelf="stretch"
              borderColor="app.border"
              borderLeftWidth="1px"
              gap="0"
              minW="0"
              ml="6"
              overflow="hidden"
              w="auto"
            >
              {group.items.map((item) => {
                const selected = picked === item.label
                return (
                  <Flex
                    align="center"
                    as="button"
                    cursor="pointer"
                    gap="2"
                    h="8"
                    key={item.label}
                    pr="3"
                    type="button"
                    w="full"
                    {...navRowProps(mark, selected)}
                    onClick={() => onPick(item.label)}
                  >
                    <Flex h="8" placeContent="center" placeItems="center" w="8">
                      <item.icon size={16} weight="light" />
                    </Flex>
                    <Text flex="1" fontSize="sm" textAlign="left">
                      {item.label}
                    </Text>
                    <Text fontFamily="mono" fontSize="2xs" letterSpacing="wide" w="8">
                      {item.spec}
                    </Text>
                  </Flex>
                )
              })}
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}
