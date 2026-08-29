import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { brandSteps, defaultDraft, type ThemeDraft } from './draft'

function px(value: number) {
  return `${Math.max(0, value)}px`
}

function radiusScale(radius: string) {
  const n = Number.parseInt(radius, 10) || 12
  return {
    none: { value: '0' },
    sm: { value: px(Math.max(4, n - 4)) },
    md: { value: px(n) },
    lg: { value: px(n + 4) },
    xl: { value: px(n + 8) },
    '2xl': { value: px(n + 12) },
    '3xl': { value: px(n + 20) },
    '4xl': { value: px(n + 28) },
  }
}

function chassisGradient(highlight: string, mid: string, shade: string) {
  return `linear-gradient(165deg, ${highlight} 0%, ${mid} 48%, ${shade} 100%)`
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
        backgroundImage: 'gradients.chassis',
        color: 'fg',
        margin: '0',
      },
      'h1, h2, h3, h4': {
        fontFamily: 'heading',
        fontWeight: '500',
        letterSpacing: '-0.02em',
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
          xs: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.55)' },
          sm: {
            value:
              'inset 0 1px 0 rgba(255, 255, 255, 1), 0 0 0 1px rgba(90, 96, 102, 0.16), inset 0 2px 8px rgba(0, 0, 0, 0.04)',
          },
          md: { value: 'inset 0 2px 10px rgba(0, 0, 0, 0.08)' },
          lg: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.4)' },
          xl: { value: 'none' },
        },
        gradients: {
          chassisLight: {
            value: chassisGradient(draft.brand['50'], draft.surfaces.bg.light, draft.surfaces.well.light),
          },
          chassisDark: {
            value: chassisGradient(draft.brand['700'], draft.surfaces.bg.dark, draft.surfaces.well.dark),
          },
        },
      },
      semanticTokens: {
        gradients: {
          chassis: {
            value: { _light: '{gradients.chassisLight}', _dark: '{gradients.chassisDark}' },
          },
        },
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
  const brand = brandSteps
    .map((step) => `          ${step}: { value: ${quote(draft.brand[step])} },`)
    .join('\n')

  return `import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  cssVarsPrefix: 'tony',
  globalCss: {
    'html, body': {
      minHeight: '100%',
    },
    body: {
      bg: 'app.bg',
      backgroundImage: 'gradients.chassis',
      color: 'fg',
      margin: '0',
    },
    'h1, h2, h3, h4': {
      fontFamily: 'heading',
      fontWeight: '500',
      letterSpacing: '-0.02em',
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
        sm: { value: ${quote(radiusScale(draft.radius).sm.value)} },
        md: { value: ${quote(radiusScale(draft.radius).md.value)} },
        lg: { value: ${quote(radiusScale(draft.radius).lg.value)} },
        xl: { value: ${quote(radiusScale(draft.radius).xl.value)} },
        '2xl': { value: ${quote(radiusScale(draft.radius)['2xl'].value)} },
        '3xl': { value: ${quote(radiusScale(draft.radius)['3xl'].value)} },
        '4xl': { value: ${quote(radiusScale(draft.radius)['4xl'].value)} },
      },
      shadows: {
        xs: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.55)' },
        sm: { value: 'inset 0 1px 0 rgba(255, 255, 255, 1), 0 0 0 1px rgba(90, 96, 102, 0.16), inset 0 2px 8px rgba(0, 0, 0, 0.04)' },
        md: { value: 'inset 0 2px 10px rgba(0, 0, 0, 0.08)' },
        lg: { value: 'inset 0 1px 0 rgba(255, 255, 255, 0.4)' },
        xl: { value: 'none' },
      },
      gradients: {
        chassisLight: { value: ${quote(chassisGradient(draft.brand['50'], draft.surfaces.bg.light, draft.surfaces.well.light))} },
        chassisDark: { value: ${quote(chassisGradient(draft.brand['700'], draft.surfaces.bg.dark, draft.surfaces.well.dark))} },
      },
    },
    semanticTokens: {
      gradients: {
        chassis: {
          value: { _light: '{gradients.chassisLight}', _dark: '{gradients.chassisDark}' },
        },
      },
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
