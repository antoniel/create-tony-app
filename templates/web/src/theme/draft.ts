import { brandFromSeed, brandSteps, surfacesFromSeed, type BrandStep } from './color'

export { brandSteps, type BrandStep }

export const defaultSeed = '#434343'

export interface ThemeDraft {
  seed: string
  brand: Record<BrandStep, string>
  surfaces: {
    bg: { light: string; dark: string }
    surface: { light: string; dark: string }
    border: { light: string; dark: string }
    highlight: { light: string; dark: string }
    recess: { light: string; dark: string }
    well: { light: string; dark: string }
  }
  accent: string
  fonts: {
    heading: string
    body: string
    mono: string
  }
}

export function draftFromSeed(
  seed: string,
  current?: Pick<ThemeDraft, 'accent' | 'fonts'>,
): ThemeDraft {
  return {
    seed,
    brand: brandFromSeed(seed),
    surfaces: surfacesFromSeed(seed),
    accent: current?.accent ?? '#ff5418',
    fonts: current?.fonts ?? {
      heading: '"Inter", Helvetica, Arial, sans-serif',
      body: '"Inter", Helvetica, Arial, sans-serif',
      mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
    },
  }
}

export const defaultDraft: ThemeDraft = draftFromSeed(defaultSeed)
