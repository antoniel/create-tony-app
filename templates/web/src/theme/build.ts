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
        letterSpacing: '-0.03em',
      },
    },
    theme: {
      tokens: {
        colors: {
          brand: Object.fromEntries(brandSteps.map((step) => [step, { value: draft.brand[step] }])),
          accent: { value: draft.accent },
        },
        fonts: {
          heading: { value: draft.fonts.heading },
          body: { value: draft.fonts.body },
          mono: { value: draft.fonts.mono },
        },
        radii: radiusScale(draft.radius),
        shadows: {
          xs: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.35)' },
          sm: { value: '0 1px 0 rgba(0, 0, 0, 0.06)' },
          md: { value: '0 8px 24px rgba(0, 0, 0, 0.08)' },
          lg: { value: '0 16px 32px rgba(0, 0, 0, 0.1)' },
          xl: { value: '0 24px 40px rgba(0, 0, 0, 0.12)' },
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
            well: {
              value: { _light: draft.surfaces.well.light, _dark: draft.surfaces.well.dark },
            },
            accent: { value: '{colors.accent}' },
          },
          brand: {
            solid: {
              value: { _light: '{colors.brand.800}', _dark: '{colors.brand.100}' },
            },
            contrast: {
              value: { _light: '{colors.white}', _dark: '{colors.black}' },
            },
            fg: {
              value: { _light: '{colors.brand.800}', _dark: '{colors.brand.100}' },
            },
            muted: { value: '{colors.brand.100}' },
            subtle: {
              value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
            },
            emphasized: { value: '{colors.brand.200}' },
            focusRing: { value: '{colors.accent}' },
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
      letterSpacing: '-0.03em',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
${brand}
        },
        accent: { value: ${quote(draft.accent)} },
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
        xs: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.35)' },
        sm: { value: '0 1px 0 rgba(0, 0, 0, 0.06)' },
        md: { value: '0 8px 24px rgba(0, 0, 0, 0.08)' },
        lg: { value: '0 16px 32px rgba(0, 0, 0, 0.1)' },
        xl: { value: '0 24px 40px rgba(0, 0, 0, 0.12)' },
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
          well: {
            value: { _light: ${quote(draft.surfaces.well.light)}, _dark: ${quote(draft.surfaces.well.dark)} },
          },
          accent: { value: '{colors.accent}' },
        },
        brand: {
          solid: {
            value: { _light: '{colors.brand.800}', _dark: '{colors.brand.100}' },
          },
          contrast: {
            value: { _light: '{colors.white}', _dark: '{colors.black}' },
          },
          fg: {
            value: { _light: '{colors.brand.800}', _dark: '{colors.brand.100}' },
          },
          muted: { value: '{colors.brand.100}' },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
          },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.accent}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
`
}
