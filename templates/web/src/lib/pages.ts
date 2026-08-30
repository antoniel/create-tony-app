export const componentPages = [
  { index: 'buttons', label: 'buttons', spec: '02' },
  { index: 'marks', label: 'marks', spec: '03' },
  { index: 'url', label: 'url', spec: '04' },
] as const

export const themePages = [
  { index: 'seed', label: 'seed', spec: '05' },
  { index: 'surfaces', label: 'surf', spec: '06' },
  { index: 'fonts', label: 'type', spec: '07' },
  { index: 'file', label: 'file', spec: '08' },
] as const

export type ComponentIndex = (typeof componentPages)[number]['index']
export type ThemeIndex = (typeof themePages)[number]['index']

export function componentTo(index: ComponentIndex) {
  return `/components/${index}` as const
}

export function themeTo(index: ThemeIndex) {
  return `/theme/${index}` as const
}

export function isComponentIndex(value: string): value is ComponentIndex {
  return componentPages.some((page) => page.index === value)
}

export function isThemeIndex(value: string): value is ThemeIndex {
  return themePages.some((page) => page.index === value)
}

export const componentPager = componentPages.map((page) => ({
  to: componentTo(page.index),
  label: page.label,
}))

export const themePager = themePages.map((page) => ({
  to: themeTo(page.index),
  label: page.label,
}))
