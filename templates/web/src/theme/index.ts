import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  cssVarsPrefix: 'tony',
  globalCss: {
    'html, body': {
      minHeight: '100%',
    },
    body: {
      bg: 'app.bg',
      color: 'fg',
      margin: '0',
    },
    'h1, h2, h3, h4': {
      fontFamily: 'heading',
      fontWeight: '500',
      letterSpacing: '-0.035em',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f6f6f6' },
          100: { value: '#e8e8e8' },
          200: { value: '#d2d2d2' },
          300: { value: '#b0b0b0' },
          400: { value: '#7a7a7a' },
          500: { value: '#2a2a2a' },
          600: { value: '#1a1a1a' },
          700: { value: '#111111' },
          800: { value: '#0a0a0a' },
          900: { value: '#050505' },
          950: { value: '#000000' },
        },
      },
      fonts: {
        heading: { value: '"Inter Tight", Helvetica, Arial, sans-serif' },
        body: { value: '"Inter Tight", Helvetica, Arial, sans-serif' },
        mono: { value: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace' },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0' },
        md: { value: '0' },
        lg: { value: '0' },
        xl: { value: '0' },
        '2xl': { value: '0' },
        '3xl': { value: '0' },
        '4xl': { value: '0' },
      },
      shadows: {
        xs: { value: 'none' },
        sm: { value: 'none' },
        md: { value: 'none' },
        lg: { value: 'none' },
        xl: { value: 'none' },
      },
    },
    semanticTokens: {
      colors: {
        app: {
          bg: {
            value: { _light: '#f4f4f4', _dark: '#0a0a0a' },
          },
          surface: {
            value: { _light: '#ffffff', _dark: '#111111' },
          },
          border: {
            value: { _light: '#e2e2e2', _dark: '#2a2a2a' },
          },
        },
        brand: {
          solid: {
            value: { _light: '{colors.brand.800}', _dark: '{colors.white}' },
          },
          contrast: {
            value: { _light: '{colors.white}', _dark: '{colors.black}' },
          },
          fg: {
            value: { _light: '{colors.brand.800}', _dark: '{colors.white}' },
          },
          muted: { value: '{colors.brand.100}' },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
          },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.brand.700}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
