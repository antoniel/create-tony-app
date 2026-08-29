export const brandSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const

export type BrandStep = (typeof brandSteps)[number]

export interface ThemeDraft {
  brand: Record<BrandStep, string>
  surfaces: {
    bg: { light: string; dark: string }
    surface: { light: string; dark: string }
    border: { light: string; dark: string }
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  radius: string
}

export const defaultDraft: ThemeDraft = {
  brand: {
    '50': '#f6f6f6',
    '100': '#e8e8e8',
    '200': '#d2d2d2',
    '300': '#b0b0b0',
    '400': '#7a7a7a',
    '500': '#2a2a2a',
    '600': '#1a1a1a',
    '700': '#111111',
    '800': '#0a0a0a',
    '900': '#050505',
    '950': '#000000',
  },
  surfaces: {
    bg: { light: '#f4f4f4', dark: '#0a0a0a' },
    surface: { light: '#ffffff', dark: '#111111' },
    border: { light: '#e2e2e2', dark: '#2a2a2a' },
  },
  fonts: {
    heading: '"Inter Tight", Helvetica, Arial, sans-serif',
    body: '"Inter Tight", Helvetica, Arial, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  },
  radius: '0',
}
