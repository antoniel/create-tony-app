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
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f3f0ff' },
          100: { value: '#e9e2ff' },
          200: { value: '#d5c7ff' },
          300: { value: '#b8a0ff' },
          400: { value: '#9872ff' },
          500: { value: '#7c3aed' },
          600: { value: '#6d28d9' },
          700: { value: '#5b21b6' },
          800: { value: '#4c1d95' },
          900: { value: '#3f1a78' },
          950: { value: '#27104f' },
        },
      },
      fonts: {
        body: { value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
        heading: { value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        app: {
          bg: {
            value: { _light: '{colors.gray.50}', _dark: '{colors.gray.950}' },
          },
          surface: {
            value: { _light: '{colors.white}', _dark: '{colors.gray.900}' },
          },
          border: {
            value: { _light: '{colors.gray.200}', _dark: '{colors.gray.800}' },
          },
        },
        brand: {
          solid: { value: '{colors.brand.600}' },
          contrast: { value: '{colors.white}' },
          fg: {
            value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' },
          },
          muted: { value: '{colors.brand.100}' },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' },
          },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
