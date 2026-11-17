import defaults from './design-defaults.json'

export type ComponentId = 'button' | 'input' | 'switch' | 'invite' | 'access' | 'settings'

export interface Appearance {
  color: string
  radius: number
}

export interface Design {
  brand: string
  fontSize: number
  overrides: Partial<Record<ComponentId, Partial<Appearance>>>
}

export const components = {
  button: { name: 'Button', description: 'Trigger an action', uses: [] },
  input: { name: 'Input', description: 'Collect text', uses: [] },
  switch: { name: 'Switch', description: 'Toggle a setting', uses: [] },
  invite: {
    name: 'Invite form',
    description: 'Collect an email address',
    uses: ['input', 'button'],
  },
  access: {
    name: 'Access controls',
    description: 'Manage access and review details',
    uses: ['switch', 'button'],
  },
  settings: {
    name: 'Workspace settings',
    description: 'Compose a settings screen',
    uses: ['invite', 'access'],
  },
} satisfies Record<ComponentId, { name: string; description: string; uses: ComponentId[] }>

export const levels: { name: string; cluster: string; cards: ComponentId[] }[] = [
  { name: 'Atoms', cluster: 'Controls', cards: ['button', 'input', 'switch'] },
  { name: 'Molecules', cluster: 'Forms & settings', cards: ['invite', 'access'] },
  { name: 'Organisms', cluster: 'Workspace', cards: ['settings'] },
]

export const storageKey = 'tony-studio.design.v1'

export function readDesign(serialized: string | null): Design {
  if (serialized === null) return defaults
  try {
    const design: Design = JSON.parse(serialized)
    if (
      !isColor(design.brand) ||
      !Number.isInteger(design.fontSize) ||
      design.fontSize < 12 ||
      design.fontSize > 20
    ) {
      return defaults
    }
    const overrides: Design['overrides'] = {}
    for (const { cards } of levels) {
      for (const id of cards) {
        const appearance = design.overrides?.[id]
        if (!appearance) continue
        const { color, radius } = appearance
        const normalized: Partial<Appearance> = {}
        if (color !== undefined && isColor(color)) normalized.color = color
        if (radius !== undefined && Number.isInteger(radius) && radius >= 0 && radius <= 24)
          normalized.radius = radius
        if (Object.keys(normalized).length) overrides[id] = normalized
      }
    }
    return { brand: design.brand, fontSize: design.fontSize, overrides }
  } catch {
    return defaults
  }
}

export function appearanceFor(design: Design, id: ComponentId): Appearance {
  return { color: design.brand, radius: 9, ...design.overrides[id] }
}

export function isColor(value: string) {
  return String(value) === value && /^#[0-9a-f]{6}$/i.test(value)
}
