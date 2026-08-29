export const brandSteps = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

export type BrandStep = (typeof brandSteps)[number]

export interface ThemeDraft {
  brand: Record<BrandStep, string>
  surfaces: {
    bg: { light: string; dark: string }
    surface: { light: string; dark: string }
    border: { light: string; dark: string }
    well: { light: string; dark: string }
  }
  accent: string
  fonts: {
    heading: string
    body: string
    mono: string
  }
}

export const defaultDraft: ThemeDraft = {
  brand: {
    '50': '#f7f8f9',
    '100': '#eef0f2',
    '200': '#d4d8dc',
    '300': '#b4bac0',
    '400': '#8f969e',
    '500': '#6f777f',
    '600': '#565d64',
    '700': '#3f4449',
    '800': '#2a2e32',
    '900': '#181b1e',
    '950': '#0c0e10',
  },
  surfaces: {
    bg: { light: '#c9ced4', dark: '#2a2e32' },
    surface: { light: '#ffffff', dark: '#181b1e' },
    border: { light: '#b4b9bf', dark: '#3f4449' },
    well: { light: '#bec3c9', dark: '#22262a' },
  },
  accent: '#ff5418',
  fonts: {
    heading: '"Inter", Helvetica, Arial, sans-serif',
    body: '"Inter", Helvetica, Arial, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  },
}
