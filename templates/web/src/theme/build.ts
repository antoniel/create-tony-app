import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { hexAlpha, mixHex } from './color'
import { brandSteps, defaultDraft, type ThemeDraft } from './draft'

const edgeRadius = '4px'
const controlRadius = '8px'
const plateRadius = '24px'

export const chassisImage =
  'linear-gradient(180deg, var(--tony-colors-app-chassis-hi) 0%, var(--tony-colors-app-chassis-mid) 48%, var(--tony-colors-app-chassis-lo) 100%)'

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
      overscrollBehavior: 'none',
    },
    body: {
      bgColor: 'app.bg',
      backgroundImage: 'linear-gradient(180deg, var(--tony-colors-app-chassis-hi) 0%, var(--tony-colors-app-chassis-mid) 48%, var(--tony-colors-app-chassis-lo) 100%)',
      color: 'fg',
      margin: '0',
    },
    '*, *::before, *::after': {
      accentColor: 'app.focus',
    },
    '*:focus': {
      outline: 'none',
    },
    '*:focus-visible': {
      outlineColor: 'app.focus',
      outlineOffset: '0',
      outlineStyle: 'solid',
      outlineWidth: '1px',
    },
    '::selection': {
      background: 'app.focus',
      color: { _light: 'app.surface', _dark: 'brand.950' },
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
        sm: { value: ${quote(edgeRadius)} },
        md: { value: ${quote(controlRadius)} },
        '2xl': { value: ${quote(plateRadius)} },
        full: { value: '9999px' },
        l1: { value: ${quote(edgeRadius)} },
        l2: { value: ${quote(controlRadius)} },
        l3: { value: ${quote(plateRadius)} },
      },
      shadows: {
        xs: { value: ${quote(edgeShadows(draft).xs.light)} },
        sm: { value: ${quote(edgeShadows(draft).sm.light)} },
      },
      letterSpacings: {
        tight: { value: '-0.02em' },
        wide: { value: '0.14em' },
        widest: { value: '0.2em' },
      },
      lineHeights: {
        none: { value: '1' },
        plate: { value: '1.05' },
      },
    },
    semanticTokens: {
      colors: {
        app: {
          bg: {
            value: { _light: ${quote(chassisTone(draft).light.bg)}, _dark: ${quote(chassisTone(draft).dark.bg)} },
          },
          surface: {
            value: { _light: ${quote(draft.surfaces.surface.light)}, _dark: ${quote(draft.surfaces.surface.dark)} },
          },
          border: {
            value: { _light: ${quote(draft.surfaces.border.light)}, _dark: ${quote(draft.surfaces.border.dark)} },
          },
          highlight: {
            value: { _light: ${quote(draft.surfaces.highlight.light)}, _dark: ${quote(draft.surfaces.highlight.dark)} },
          },
          recess: {
            value: { _light: ${quote(draft.surfaces.recess.light)}, _dark: ${quote(draft.surfaces.recess.dark)} },
          },
          well: {
            value: { _light: ${quote(chassisTone(draft).light.well)}, _dark: ${quote(chassisTone(draft).dark.well)} },
          },
          chassis: {
            hi: { value: { _light: ${quote(chassisTone(draft).light.hi)}, _dark: ${quote(chassisTone(draft).dark.hi)} } },
            mid: { value: { _light: ${quote(chassisTone(draft).light.mid)}, _dark: ${quote(chassisTone(draft).dark.mid)} } },
            lo: { value: { _light: ${quote(chassisTone(draft).light.lo)}, _dark: ${quote(chassisTone(draft).dark.lo)} } },
          },
          accent: { value: '{colors.accent}' },
          focus: {
            value: { _light: ${quote(draft.surfaces.recess.light)}, _dark: ${quote(draft.brand['200'])} },
          },
          spot: {
            value: { _light: ${quote(draft.brand['100'])}, _dark: ${quote(mixHex(draft.brand['800'], '#ffffff', 0.08))} },
          },
        },
        brand: {
          solid: {
            value: { _light: '{colors.brand.950}', _dark: '{colors.brand.50}' },
          },
          contrast: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' },
          },
          fg: {
            value: { _light: '{colors.brand.950}', _dark: '{colors.brand.50}' },
          },
          muted: { value: '{colors.brand.100}' },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
          },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.app.focus}' },
        },
        shadows: {
          xs: { value: { _light: ${quote(edgeShadows(draft).xs.light)}, _dark: ${quote(edgeShadows(draft).xs.dark)} } },
          sm: { value: { _light: ${quote(edgeShadows(draft).sm.light)}, _dark: ${quote(edgeShadows(draft).sm.dark)} } },
        },
      },
      recipes: {
        button: {
          base: {
            focusVisibleRing: 'none',
          },
          variants: {
            variant: {
              solid: {
                bg: { _light: 'brand.950', _dark: 'brand.50' },
                color: { _light: 'brand.50', _dark: 'brand.950' },
                borderColor: 'transparent',
              },
              outline: {
                borderColor: 'app.border',
                color: 'fg',
              },
            },
          },
        },
        badge: {
          variants: {
            variant: {
              solid: {
                bg: { _light: 'brand.950', _dark: 'brand.50' },
                color: { _light: 'brand.50', _dark: 'brand.950' },
              },
            },
          },
        },
        link: {
          base: {
            focusVisibleRing: 'none',
          },
        },
      },
      slotRecipes: {
        menu: {
          slots: ['item'],
          variants: {
            variant: {
              subtle: {
                item: {
                  _highlighted: { bg: 'app.spot', color: 'fg' },
                },
              },
            },
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
`
}

export function buildSystem(draft: ThemeDraft = defaultDraft) {
  return createSystem(defaultConfig, buildThemeConfig(draft))
}

export const system = buildSystem(defaultDraft)

export function buildThemeConfig(draft: ThemeDraft) {
  return defineConfig({
    cssVarsPrefix: 'tony',
    globalCss: {
      'html, body': {
        minHeight: '100%',
        overscrollBehavior: 'none',
      },
      body: {
        bgColor: 'app.bg',
        backgroundImage: chassisImage,
        color: 'fg',
        margin: '0',
      },
      '*, *::before, *::after': {
        accentColor: 'app.focus',
      },
      '*:focus': {
        outline: 'none',
      },
      '*:focus-visible': {
        outlineColor: 'app.focus',
        outlineOffset: '0',
        outlineStyle: 'solid',
        outlineWidth: '1px',
      },
      '::selection': {
        background: 'app.focus',
        color: { _light: 'app.surface', _dark: 'brand.950' },
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
        radii: radii(),
        shadows: {
          xs: { value: edgeShadows(draft).xs.light },
          sm: { value: edgeShadows(draft).sm.light },
        },
        letterSpacings: {
          tight: { value: '-0.02em' },
          wide: { value: '0.14em' },
          widest: { value: '0.2em' },
        },
        lineHeights: {
          none: { value: '1' },
          plate: { value: '1.05' },
        },
      },
      semanticTokens: {
        colors: {
          app: {
            bg: {
              value: {
                _light: chassisTone(draft).light.bg,
                _dark: chassisTone(draft).dark.bg,
              },
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
            highlight: {
              value: {
                _light: draft.surfaces.highlight.light,
                _dark: draft.surfaces.highlight.dark,
              },
            },
            recess: {
              value: { _light: draft.surfaces.recess.light, _dark: draft.surfaces.recess.dark },
            },
            well: {
              value: {
                _light: chassisTone(draft).light.well,
                _dark: chassisTone(draft).dark.well,
              },
            },
            chassis: {
              hi: {
                value: { _light: chassisTone(draft).light.hi, _dark: chassisTone(draft).dark.hi },
              },
              mid: {
                value: { _light: chassisTone(draft).light.mid, _dark: chassisTone(draft).dark.mid },
              },
              lo: {
                value: { _light: chassisTone(draft).light.lo, _dark: chassisTone(draft).dark.lo },
              },
            },
            accent: { value: '{colors.accent}' },
            focus: {
              value: {
                _light: draft.surfaces.recess.light,
                _dark: draft.brand['200'],
              },
            },
            spot: {
              value: {
                _light: draft.brand['100'],
                _dark: mixHex(draft.brand['800'], '#ffffff', 0.08),
              },
            },
          },
          brand: {
            solid: {
              value: { _light: '{colors.brand.950}', _dark: '{colors.brand.50}' },
            },
            contrast: {
              value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' },
            },
            fg: {
              value: { _light: '{colors.brand.950}', _dark: '{colors.brand.50}' },
            },
            muted: { value: '{colors.brand.100}' },
            subtle: {
              value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
            },
            emphasized: { value: '{colors.brand.200}' },
            focusRing: { value: '{colors.app.focus}' },
          },
        },
        shadows: {
          xs: {
            value: { _light: edgeShadows(draft).xs.light, _dark: edgeShadows(draft).xs.dark },
          },
          sm: {
            value: { _light: edgeShadows(draft).sm.light, _dark: edgeShadows(draft).sm.dark },
          },
        },
      },
      recipes: {
        button: {
          base: {
            focusVisibleRing: 'none',
          },
          variants: {
            variant: {
              solid: {
                bg: { _light: 'brand.950', _dark: 'brand.50' },
                color: { _light: 'brand.50', _dark: 'brand.950' },
                borderColor: 'transparent',
              },
              outline: {
                borderColor: 'app.border',
                color: 'fg',
              },
            },
          },
        },
        badge: {
          variants: {
            variant: {
              solid: {
                bg: { _light: 'brand.950', _dark: 'brand.50' },
                color: { _light: 'brand.50', _dark: 'brand.950' },
              },
            },
          },
        },
        link: {
          base: {
            focusVisibleRing: 'none',
          },
        },
      },
      slotRecipes: {
        menu: {
          slots: ['item'],
          variants: {
            variant: {
              subtle: {
                item: {
                  _highlighted: { bg: 'app.spot', color: 'fg' },
                },
              },
            },
          },
        },
      },
    },
  })
}

function edgeShadows(draft: ThemeDraft) {
  return {
    xs: {
      light: `inset 0 1px 0 ${hexAlpha(draft.surfaces.highlight.light, 0.9)}, inset 1px 0 0 ${hexAlpha(draft.surfaces.highlight.light, 0.55)}`,
      dark: `inset 0 1px 0 ${hexAlpha('#ffffff', 0.08)}, inset 1px 0 0 ${hexAlpha('#ffffff', 0.04)}`,
    },
    sm: {
      light: [
        `inset 0 1px 0 ${draft.surfaces.highlight.light}`,
        `inset 1px 0 0 ${draft.surfaces.highlight.light}`,
        `0 0 0 1px ${hexAlpha(draft.surfaces.border.light, 0.7)}`,
        `inset 0 -1px 0 ${hexAlpha(draft.surfaces.recess.light, 0.18)}`,
      ].join(', '),
      dark: [
        `inset 0 1px 0 ${hexAlpha('#ffffff', 0.1)}`,
        `inset 1px 0 0 ${hexAlpha('#ffffff', 0.05)}`,
        `0 0 0 1px ${hexAlpha('#000000', 0.5)}`,
        `inset 0 -1px 0 ${hexAlpha('#000000', 0.28)}`,
      ].join(', '),
    },
  }
}

function chassisTone(draft: ThemeDraft) {
  const lift = 0.03
  const lightMid = draft.brand['50']
  const darkMid = draft.brand['800']
  return {
    light: {
      bg: lightMid,
      well: draft.brand['400'],
      hi: mixHex(lightMid, '#ffffff', lift),
      mid: lightMid,
      lo: mixHex(lightMid, '#000000', lift),
    },
    dark: {
      bg: darkMid,
      well: draft.brand['900'],
      hi: mixHex(darkMid, '#ffffff', lift),
      mid: darkMid,
      lo: mixHex(darkMid, '#000000', lift),
    },
  }
}

function radii() {
  return {
    none: { value: '0' },
    sm: { value: edgeRadius },
    md: { value: controlRadius },
    '2xl': { value: plateRadius },
    full: { value: '9999px' },
    l1: { value: edgeRadius },
    l2: { value: controlRadius },
    l3: { value: plateRadius },
  }
}

function quote(value: string) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
}
