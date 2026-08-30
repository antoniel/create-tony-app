import { Box, Button, Code, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { useState, type ChangeEvent } from 'react'
import { DocsSection } from '../../components/docs-section'
import { normalizeHex } from '../../theme/color'
import { brandSteps, draftFromSeed } from '../../theme/draft'
import { useThemeStudio } from '../../theme/studio'

const fontPresets = [
  { label: 'Inter', value: '"Inter", Helvetica, Arial, sans-serif' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace' },
] as const

export function ThemeSeedPage() {
  const { draft, setDraft } = useThemeStudio()

  return (
    <DocsSection copy="one seed. 50–950 and the chassis follow." kicker="color" title="seed">
      <Grid gap="6" templateColumns="repeat(auto-fill, minmax(14rem, 1fr))">
        <ColorField
          label="seed · brand.500"
          value={draft.seed}
          onChange={(value) => {
            const hex = normalizeHex(value)
            if (!hex) {
              setDraft((current) => ({ ...current, seed: value }))
              return
            }
            setDraft((current) => draftFromSeed(hex, current))
          }}
        />
        <ColorField
          label="power · accent"
          value={draft.accent}
          onChange={(value) => setDraft((current) => ({ ...current, accent: value }))}
        />
      </Grid>
      <Grid gap="3" pt="6" templateColumns="repeat(auto-fill, minmax(7rem, 1fr))">
        {brandSteps.map((step) => (
          <Swatch hex={draft.brand[step]} key={step} label={`brand.${step}`} />
        ))}
      </Grid>
    </DocsSection>
  )
}

export function ThemeSurfacesPage() {
  const { draft } = useThemeStudio()

  return (
    <DocsSection
      copy="white insert stays. metal is the seed. hairline, catch, shade."
      kicker="color"
      title="surfaces"
    >
      <Grid gap="3" templateColumns="repeat(auto-fill, minmax(11rem, 1fr))">
        <Swatch hex={draft.surfaces.bg.light} label="app.bg / light" />
        <Swatch hex={draft.surfaces.bg.dark} label="app.bg / dark" />
        <Swatch hex={draft.surfaces.surface.light} label="app.surface / light" />
        <Swatch hex={draft.surfaces.surface.dark} label="app.surface / dark" />
        <Swatch hex={draft.surfaces.border.light} label="app.border / light" />
        <Swatch hex={draft.surfaces.border.dark} label="app.border / dark" />
        <Swatch hex={draft.surfaces.highlight.light} label="app.highlight / light" />
        <Swatch hex={draft.surfaces.highlight.dark} label="app.highlight / dark" />
        <Swatch hex={draft.surfaces.recess.light} label="app.recess / light" />
        <Swatch hex={draft.surfaces.recess.dark} label="app.recess / dark" />
        <Swatch hex={draft.surfaces.well.light} label="app.well / light" />
        <Swatch hex={draft.surfaces.well.dark} label="app.well / dark" />
      </Grid>
    </DocsSection>
  )
}

export function ThemeFontsPage() {
  const { draft, setDraft } = useThemeStudio()

  return (
    <DocsSection
      copy="inter on the plate. plex mono on the etch. that is the stack."
      kicker="type"
      title="fonts"
    >
      <Stack gap="4">
        {(['heading', 'body', 'mono'] as const).map((role) => (
          <Stack borderColor="app.border" borderWidth="1px" gap="3" key={role} p="4" shadow="xs">
            <Text fontFamily="mono" fontSize="2xs" letterSpacing="wide">
              {role.toUpperCase()}
            </Text>
            <Box
              as="input"
              bg="app.bg"
              borderColor="app.border"
              borderWidth="1px"
              color="fg"
              fontFamily="mono"
              fontSize="sm"
              px="3"
              py="2"
              value={draft.fonts[role]}
              w="full"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setDraft((current) => ({
                  ...current,
                  fonts: { ...current.fonts, [role]: event.target.value },
                }))
              }
            />
            <Flex gap="2" wrap="wrap">
              {fontPresets.map((preset) => (
                <Button
                  colorPalette="brand"
                  key={`${role}-${preset.label}`}
                  size="xs"
                  variant={draft.fonts[role] === preset.value ? 'solid' : 'outline'}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      fonts: { ...current.fonts, [role]: preset.value },
                    }))
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </Flex>
          </Stack>
        ))}
      </Stack>
    </DocsSection>
  )
}

export function ThemeFilePage() {
  const { source } = useThemeStudio()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <DocsSection
      copy="paste this over apps/web/src/theme/index.ts in the generated app."
      kicker="export"
      title="chakra file"
    >
      <Stack gap="4">
        <Button colorPalette="brand" w="fit-content" onClick={copy}>
          {copied ? 'Copied' : 'Copy theme file'}
        </Button>
        <Box
          as="pre"
          bg="app.bg"
          borderColor="app.border"
          borderWidth="1px"
          color="fg"
          fontFamily="mono"
          fontSize="xs"
          shadow="xs"
          maxH="xl"
          overflow="auto"
          p="4"
          whiteSpace="pre"
        >
          {source}
        </Box>
      </Stack>
    </DocsSection>
  )
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <Stack borderColor="app.border" borderWidth="1px" gap="3" p="3" shadow="xs">
      <Box bg={`[${hex}]`} h="14" />
      <Text fontFamily="mono" fontSize="2xs">
        {label}
      </Text>
      <Code fontSize="2xs">{hex}</Code>
    </Stack>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const hex = /^#([0-9a-fA-F]{6})$/.test(value) ? value : '#000000'

  return (
    <Stack borderColor="app.border" borderWidth="1px" gap="3" p="3" shadow="xs">
      <Box bg={`[${value}]`} h="14" />
      <Text fontFamily="mono" fontSize="2xs">
        {label}
      </Text>
      <Flex align="center" gap="2">
        <Box
          as="input"
          bg="transparent"
          borderColor="app.border"
          borderWidth="1px"
          h="8"
          p="0"
          type="color"
          value={hex}
          w="8"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
        <Box
          as="input"
          bg="app.bg"
          borderColor="app.border"
          borderWidth="1px"
          color="fg"
          flex="1"
          fontFamily="mono"
          fontSize="xs"
          minW="0"
          px="2"
          py="1"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
      </Flex>
    </Stack>
  )
}
