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

const lightMix = {
  '50': 0.92,
  '100': 0.84,
  '200': 0.68,
  '300': 0.48,
  '400': 0.24,
} as const

const darkMix = {
  '600': 0.22,
  '700': 0.42,
  '800': 0.58,
  '900': 0.74,
  '950': 0.86,
} as const

const lightMetal = {
  '50': 0.4,
  '100': 0.5,
  '200': 0.7,
  '300': 0.88,
  '400': 0.92,
} as const

export function surfacesFromSeed(seed: string) {
  const brand = brandFromSeed(seed)
  return {
    bg: { light: brand['50'], dark: brand['800'] },
    surface: { light: '#ffffff', dark: brand['900'] },
    border: { light: brand['200'], dark: brand['700'] },
    highlight: { light: '#ffffff', dark: mixHex(brand['700'], '#ffffff', 0.16) },
    recess: { light: brand['300'], dark: mixHex(brand['900'], '#000000', 0.2) },
    well: { light: brand['400'], dark: mixHex(brand['800'], '#000000', 0.12) },
  }
}

export function brandFromSeed(seed: string) {
  const hex = normalizeHex(seed) ?? '#434343'
  return {
    '50': liftTowardMetal(hex, '50'),
    '100': liftTowardMetal(hex, '100'),
    '200': liftTowardMetal(hex, '200'),
    '300': liftTowardMetal(hex, '300'),
    '400': liftTowardMetal(hex, '400'),
    '500': hex,
    '600': mixHex(hex, '#000000', darkMix['600']),
    '700': mixHex(hex, '#000000', darkMix['700']),
    '800': mixHex(hex, '#000000', darkMix['800']),
    '900': mixHex(hex, '#000000', darkMix['900']),
    '950': mixHex(hex, '#000000', darkMix['950']),
  } satisfies Record<BrandStep, string>
}

export function hexAlpha(hex: string, alpha: number) {
  const [r, g, b] = parseRgb(normalizeHex(hex) ?? hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function mixHex(hex: string, toward: string, amount: number) {
  const [ar, ag, ab] = parseRgb(hex)
  const [br, bg, bb] = parseRgb(toward)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * amount)
  return toHex(mix(ar, br), mix(ag, bg), mix(ab, bb))
}

export function normalizeHex(value: string) {
  const raw = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
    return raw.toLowerCase()
  }
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const [, a, b, c] = raw
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase()
  }
  return null
}

function liftTowardMetal(hex: string, step: keyof typeof lightMix) {
  const lifted = mixHex(hex, '#eef2f5', lightMix[step])
  return mixHex(lifted, steelOf(lifted), lightMetal[step])
}

function steelOf(hex: string) {
  const [r, g, b] = parseRgb(hex)
  const y = Math.round((r + g + b) / 3)
  return toHex(Math.max(0, y - 3), y, Math.min(255, y + 6))
}

function parseRgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}
