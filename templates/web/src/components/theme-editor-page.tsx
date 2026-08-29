import { Box, Button, Code, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { useState, type ChangeEvent } from 'react'
import { DocsSection, PageFrame, PageIntro } from './docs-section'
import { brandSteps, type ThemeDraft } from '../theme/draft'
import { useThemeStudio } from '../theme/studio'

const fontPresets = [
  { label: 'Inter', value: '"Inter", Helvetica, Arial, sans-serif' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace' },
] as const

export function ThemeEditorPage() {
  const { draft, source, setDraft, reset } = useThemeStudio()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <PageFrame>
      <Stack gap="16">
        <PageIntro maxW="3xl" spec="03" title="tune">
          <Text color="fg.muted">
            rebuilds the system live. copy into <Code>apps/web/src/theme/index.ts</Code>
          </Text>
          <Flex gap="3" wrap="wrap">
            <Button colorPalette="brand" onClick={copy} variant="solid">
              {copied ? 'Copied' : 'Copy theme file'}
            </Button>
            <Button colorPalette="brand" onClick={reset} variant="outline">
              Reset
            </Button>
          </Flex>
        </PageIntro>

        <DocsSection
          copy="metal ramp behind colorPalette=brand."
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
          copy="chassis, plate, seam, slot. light and dark in the file."
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
          copy="inter on the plate. plex mono on the etch. that is the stack."
          kicker="type"
          title="fonts"
        >
          <Stack gap="4">
            {(['heading', 'body', 'mono'] as const).map((role) => (
              <Stack borderColor="app.border" borderWidth="1px" gap="3" key={role} p="4">
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
    </PageFrame>
  )
}

function patchSurface(
  setDraft: (next: ThemeDraft | ((current: ThemeDraft) => ThemeDraft)) => void,
  token: keyof ThemeDraft['surfaces'],
  mode: 'light' | 'dark',
  value: string,
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
