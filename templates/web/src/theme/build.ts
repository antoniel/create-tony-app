import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { brandSteps, defaultDraft, type ThemeDraft } from './draft'

function radiusScale(radius: string) {
  return {
    none: { value: '0' },
    sm: { value: radius },
    md: { value: radius },
    lg: { value: radius },
    xl: { value: radius },
    '2xl': { value: radius },
    '3xl': { value: radius },
    '4xl': { value: radius },
  }
}

export function buildThemeConfig(draft: ThemeDraft) {
  return defineConfig({
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
          brand: Object.fromEntries(brandSteps.map((step) => [step, { value: draft.brand[step] }])),
        },
        fonts: {
          heading: { value: draft.fonts.heading },
          body: { value: draft.fonts.body },
          mono: { value: draft.fonts.mono },
        },
        radii: radiusScale(draft.radius),
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
              value: { _light: draft.surfaces.bg.light, _dark: draft.surfaces.bg.dark },
            },
            surface: {
              value: {
                _light: draft.surfaces.surface.light,
                _dark: draft.surfaces.surface.dark,
              },
            },
            border: {
              value: { _light: draft.surfaces.border.light, _dark: draft.surfaces.border.dark },
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
}

export function buildSystem(draft: ThemeDraft = defaultDraft) {
  return createSystem(defaultConfig, buildThemeConfig(draft))
}

export const system = buildSystem(defaultDraft)

function quote(value: string) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
}

export function themeSource(draft: ThemeDraft) {
  const brand = brandSteps.map((step) => `          ${step}: { value: ${quote(draft.brand[step])} },`).join('\n')

  return `import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

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
${brand}
        },
      },
      fonts: {
        heading: { value: ${quote(draft.fonts.heading)} },
        body: { value: ${quote(draft.fonts.body)} },
        mono: { value: ${quote(draft.fonts.mono)} },
      },
      radii: {
        none: { value: '0' },
        sm: { value: ${quote(draft.radius)} },
        md: { value: ${quote(draft.radius)} },
        lg: { value: ${quote(draft.radius)} },
        xl: { value: ${quote(draft.radius)} },
        '2xl': { value: ${quote(draft.radius)} },
        '3xl': { value: ${quote(draft.radius)} },
        '4xl': { value: ${quote(draft.radius)} },
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
            value: { _light: ${quote(draft.surfaces.bg.light)}, _dark: ${quote(draft.surfaces.bg.dark)} },
          },
          surface: {
            value: { _light: ${quote(draft.surfaces.surface.light)}, _dark: ${quote(draft.surfaces.surface.dark)} },
          },
          border: {
            value: { _light: ${quote(draft.surfaces.border.light)}, _dark: ${quote(draft.surfaces.border.dark)} },
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
`
}
