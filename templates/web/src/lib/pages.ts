export const componentIndexes = [
  'accordion',
  'action-bar',
  'alert',
  'avatar',
  'badge',
  'blockquote',
  'breadcrumb',
  'button',
  'card',
  'carousel',
  'checkbox',
  'checkbox-card',
  'clipboard',
  'close-button',
  'code',
  'color-picker',
  'combobox',
  'data-list',
  'dialog',
  'drawer',
  'empty-state',
  'field',
  'file-upload',
  'floating-panel',
  'heading',
  'hover-card',
  'icon-button',
  'input',
  'input-group',
  'kbd',
  'link-button',
  'menu',
  'native-select',
  'number-input',
  'pagination',
  'password-input',
  'pin-input',
  'popover',
  'progress',
  'progress-circle',
  'prose',
  'qr-code',
  'radio',
  'radio-card',
  'rating',
  'segmented-control',
  'select',
  'separator',
  'skeleton',
  'slider',
  'spinner',
  'splitter',
  'stat',
  'status',
  'stepper-input',
  'steps',
  'switch',
  'table',
  'tabs',
  'tag',
  'tags-input',
  'textarea',
  'timeline',
  'toaster',
  'toggle',
  'toggle-tip',
  'tooltip',
] as const

export type ComponentIndex = (typeof componentIndexes)[number]

export const componentPages = componentIndexes.map((index, i) => ({
  index,
  label: index.replaceAll('-', ' '),
  spec: String(i + 1).padStart(2, '0'),
}))

export function componentTo(index: ComponentIndex) {
  return {
    to: '/components/$index' as const,
    params: { index },
  }
}

export function componentPath(index: ComponentIndex) {
  return `/components/${index}`
}

export function isComponentIndex(value: string): value is ComponentIndex {
  return (componentIndexes as readonly string[]).includes(value)
}

export const componentPager = componentPages.map((page) => ({
  ...componentTo(page.index),
  href: componentPath(page.index),
  label: page.label,
}))
