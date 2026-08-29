import { Badge, Box, Button, Code, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { useState, type ChangeEvent } from 'react'
import { DocsSection } from './docs-section'
import { brandSteps, type ThemeDraft } from '../theme/draft'
import { useThemeStudio } from '../theme/studio'

const fontPresets = [
  { label: 'Inter Tight', value: '"Inter Tight", Helvetica, Arial, sans-serif' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace' },
  { label: 'Space Grotesk', value: '"Space Grotesk", Helvetica, Arial, sans-serif' },
  { label: 'Instrument Serif', value: '"Instrument Serif", "Times New Roman", serif' },
  { label: 'System', value: 'ui-sans-serif, system-ui, sans-serif' },
] as const

const radiusPresets = ['0', '2px', '4px', '6px', '8px', '12px'] as const

export function ThemeEditorPage() {
  const { draft, source, setDraft, reset } = useThemeStudio()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Container maxW="6xl" py={{ base: '10', md: '16' }}>
      <Stack gap="16">
        <Stack gap="5" maxW="3xl">
          <Badge colorPalette="brand" variant="subtle" w="fit-content">
            th-03
          </Badge>
          <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="500" lineHeight="0.95">
            Tune it. Then take the file.
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Every control rebuilds the Chakra system. Case, faceplate, and the one accent update now.
            Copy the file into <Code>apps/web/src/theme/index.ts</Code>.
          </Text>
          <Flex gap="3" wrap="wrap">
            <Button colorPalette="brand" onClick={copy} variant="solid">
              {copied ? 'Copied' : 'Copy theme file'}
            </Button>
            <Button colorPalette="brand" onClick={reset} variant="outline">
              Reset
            </Button>
          </Flex>
        </Stack>

        <DocsSection
          copy="Brand is the metal ramp behind CTAs and colorPalette=brand."
          kicker="color"
          title="Brand scale"
        >
          <Grid gap="3" templateColumns="repeat(auto-fill, minmax(11rem, 1fr))">
            {brandSteps.map((step) => (
              <ColorField
                key={step}
                label={`brand.${step}`}
                value={draft.brand[step]}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    brand: { ...current.brand, [step]: value },
                  }))
                }
              />
            ))}
          </Grid>
        </DocsSection>

        <DocsSection
          copy="Bench, case, seam, and the graphite plate. Light and dark are both in the file."
          kicker="color"
          title="Surfaces"
        >
          <Grid gap="3" templateColumns="repeat(auto-fill, minmax(14rem, 1fr))">
            <ColorField
              label="app.bg / light"
              value={draft.surfaces.bg.light}
              onChange={(value) => patchSurface(setDraft, 'bg', 'light', value)}
            />
            <ColorField
              label="app.bg / dark"
              value={draft.surfaces.bg.dark}
              onChange={(value) => patchSurface(setDraft, 'bg', 'dark', value)}
            />
            <ColorField
              label="app.surface / light"
              value={draft.surfaces.surface.light}
              onChange={(value) => patchSurface(setDraft, 'surface', 'light', value)}
            />
            <ColorField
              label="app.surface / dark"
              value={draft.surfaces.surface.dark}
              onChange={(value) => patchSurface(setDraft, 'surface', 'dark', value)}
            />
            <ColorField
              label="app.border / light"
              value={draft.surfaces.border.light}
              onChange={(value) => patchSurface(setDraft, 'border', 'light', value)}
            />
            <ColorField
              label="app.border / dark"
              value={draft.surfaces.border.dark}
              onChange={(value) => patchSurface(setDraft, 'border', 'dark', value)}
            />
            <ColorField
              label="app.well / light"
              value={draft.surfaces.well.light}
              onChange={(value) => patchSurface(setDraft, 'well', 'light', value)}
            />
            <ColorField
              label="app.well / dark"
              value={draft.surfaces.well.dark}
              onChange={(value) => patchSurface(setDraft, 'well', 'dark', value)}
            />
            <ColorField
              label="app.accent"
              value={draft.accent}
              onChange={(value) => setDraft((current) => ({ ...current, accent: value }))}
            />
          </Grid>
        </DocsSection>

        <DocsSection
          copy="Pick a preset or type a stack. Load the font in __root if it is not already there."
          kicker="type"
          title="Fonts"
        >
          <Stack gap="4">
            {(['heading', 'body', 'mono'] as const).map((role) => (
              <Stack borderColor="app.border" borderWidth="1px" gap="3" key={role} p="4">
                <Text fontFamily="mono" fontSize="2xs" letterSpacing="0.14em">
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

        <DocsSection
          copy="One value writes every radius token. 6px is a machined edge."
          kicker="shape"
          title="Radius"
        >
          <Flex gap="2" wrap="wrap">
            {radiusPresets.map((radius) => (
              <Button
                colorPalette="brand"
                key={radius}
                variant={draft.radius === radius ? 'solid' : 'outline'}
                onClick={() => setDraft((current) => ({ ...current, radius }))}
              >
                {radius}
              </Button>
            ))}
          </Flex>
        </DocsSection>

        <DocsSection
          copy="Paste this over apps/web/src/theme/index.ts in the generated app."
          kicker="export"
          title="Chakra file"
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
              maxH="xl"
              overflow="auto"
              p="4"
              whiteSpace="pre"
            >
              {source}
            </Box>
          </Stack>
        </DocsSection>
      </Stack>
    </Container>
  )
}

function patchSurface(
  setDraft: (next: ThemeDraft | ((current: ThemeDraft) => ThemeDraft)) => void,
  token: keyof ThemeDraft['surfaces'],
  mode: 'light' | 'dark',
  value: string
) {
  setDraft((current) => ({
    ...current,
    surfaces: {
      ...current.surfaces,
      [token]: { ...current.surfaces[token], [mode]: value },
    },
  }))
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
    <Stack borderColor="app.border" borderWidth="1px" gap="3" p="3">
      <Box bg={value} h="14" />
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
