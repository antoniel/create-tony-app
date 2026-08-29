export const brandSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const

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
  radius: string
}

export const defaultDraft: ThemeDraft = {
  brand: {
    '50': '#f3f3f2',
    '100': '#e4e4e2',
    '200': '#cfcfcd',
    '300': '#b0b0ad',
    '400': '#8a8a86',
    '500': '#5c5c59',
    '600': '#3f3f3c',
    '700': '#2a2a28',
    '800': '#1a1a18',
    '900': '#111110',
    '950': '#0a0a09',
  },
  surfaces: {
    bg: { light: '#d8d6d1', dark: '#1c1c1b' },
    surface: { light: '#efece7', dark: '#2a2a28' },
    border: { light: '#c2bfb8', dark: '#3d3d3a' },
    well: { light: '#2c2f32', dark: '#161718' },
  },
  accent: '#ff5418',
  fonts: {
    heading: '"Inter Tight", Helvetica, Arial, sans-serif',
    body: '"Inter Tight", Helvetica, Arial, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  },
  radius: '6px',
}
