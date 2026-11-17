import { expect, open, test } from 'nsh/test'
import { storageKey } from './design'

test('preview controls act directly and layers select a component for inspection', async () => {
  const app = await open('./App.tsx', { width: 1500, height: 800 })
  await app.press('Run (0)')
  expect(app.texts()).toContain('Run (1)')
  await app.press('id:canvas-access-open')
  expect(app.texts()).toContain('Access settings')
  await app.press('Close')
  await app.press('id:select-access')
  await app.press('Isolate preview')
  await app.press('id:isolated-open')
  expect(app.texts()).toContain('Access settings')
  await app.press('Close')
  await app.press('Back to canvas')
  expect(app.texts()).toContain('Organisms')
})

test('token and appearance edits support undo, redo, persistence and export', async () => {
  const app = await open('./App.tsx', { width: 1500, height: 800 })
  await app.press('+ Radius')
  await app.clear('label:Brand color')
  await app.type('label:Brand color', '#3355aa')
  await app.submit('label:Brand color')
  await app.press('+ Font size')
  expect(app.value('label:Component color')).toBe('#3355aa')
  const saved = app.storage()[storageKey]
  expect(JSON.parse(saved)).toEqual({
    brand: '#3355aa',
    fontSize: 16,
    overrides: { button: { radius: 10 } },
  })
  await app.press('Undo')
  expect(JSON.parse(app.storage()[storageKey]).fontSize).toBe(15)
  await app.press('Redo')
  expect(app.storage()[storageKey]).toBe(saved)
  await app.press('Copy design')
  expect(JSON.parse(app.clipboard() ?? '{}')).toEqual(JSON.parse(saved))

  const reopened = await open('./App.tsx', {
    width: 390,
    height: 800,
    storage: { [storageKey]: saved },
  })
  await reopened.press('Layers')
  await reopened.press('Button')
  expect(reopened.value('label:Brand color')).toBe('#3355aa')
  expect(reopened.texts()).toContain('10')
})
