import {
  Canvas,
  Clipboard,
  effect,
  Scroll,
  Shader,
  shadersAvailable,
  signal,
  Storage,
  Text,
  View,
  windowSize,
  type CanvasRenderingContext2D,
} from 'nsh'
import { Button, Input } from 'nsh/base'
import type { ScrollRef } from 'nsh/types'
import {
  appearanceFor,
  components,
  isColor,
  levels,
  readDesign,
  storageKey,
  type Appearance,
  type ComponentId,
  type Design,
} from './design'
import { border, ink, muted, panel, Preview, surface } from './preview'

const background = '#181511'
const row = { flexDirection: 'row', alignItems: 'center', gap: 8 } as const
const cardWidth = 252
const gutter = 72
const margin = 28
const boardWidth = 2 * margin + levels.length * cardWidth + (levels.length - 1) * gutter
const overlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
} as const
const gridSource = `
fn shade(uv: vec2f) -> vec4f {
  let point = uv * nsh.size;
  let cell = fract(point / 24.0) * 24.0;
  let dot = 1.0 - smoothstep(0.8, 1.5, length(cell - vec2f(12.0)));
  return vec4f(0.36, 0.31, 0.26, dot * 0.65);
}`

const tabs = ['Canvas', 'Layers', 'Inspector'] as const

export function NativeStudio() {
  const loaded = signal(false)
  const history = signal<{ past: Design[]; present: Design; future: Design[] }>({
    past: [],
    present: readDesign(null),
    future: [],
  })
  const design = () => history().present
  const status = signal('')
  const selected = signal<ComponentId>('button')
  const isolated = signal(false)
  const tab = signal<(typeof tabs)[number]>('Canvas')
  void Storage.getItem(storageKey)
    .then((value) => history.set({ past: [], present: readDesign(value), future: [] }))
    .catch(() => status.set('Could not load the saved design.'))
    .finally(() => loaded.set(true))

  const save = (next: Design) => {
    void Storage.setItem(storageKey, JSON.stringify(next)).catch(() =>
      status.set('Could not save the design.'),
    )
  }
  const edit = (next: Design) => {
    const { past, present } = history()
    history.set({ past: [...past.slice(-99), present], present: next, future: [] })
    save(next)
  }
  const undo = () => {
    const { past, present, future } = history()
    const previous = past.at(-1)
    if (!previous) return
    history.set({ past: past.slice(0, -1), present: previous, future: [present, ...future] })
    save(previous)
  }
  const redo = () => {
    const { past, present, future } = history()
    const [next, ...remaining] = future
    if (!next) return
    history.set({ past: [...past, present], present: next, future: remaining })
    save(next)
  }
  const select = (id: ComponentId) => {
    selected.set(id)
    if (!wide()) tab.set('Inspector')
  }
  const isolate = () => {
    isolated.set(true)
    tab.set('Canvas')
  }
  const copyDesign = () => {
    void Clipboard.writeText(JSON.stringify(design(), null, 2))
      .then(() => status.set('Design copied. Paste it into design-defaults.json.'))
      .catch(() => status.set('Could not copy the design.'))
  }
  return (
    <View
      class="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      style={{ flex: 1, backgroundColor: background }}
    >
      <View
        style={{
          ...row,
          flexWrap: 'wrap',
          padding: 12,
          backgroundColor: panel,
          borderBottomWidth: 1,
          borderColor: border,
        }}
      >
        <Text style={{ color: ink, fontSize: 20, fontWeight: 'bold', flexGrow: 1 }}>
          Tony Studio
        </Text>
        <Control label="Undo" onPress={undo} disabled={!history().past.length} />
        <Control label="Redo" onPress={redo} disabled={!history().future.length} />
        <Control label="Copy design" onPress={copyDesign} disabled={!loaded()} />
      </View>
      {!wide() && (
        <View style={{ ...row, padding: 10 }}>
          {tabs.map((name) => (
            <Control label={name} selected={tab() === name} onPress={() => tab.set(name)} />
          ))}
        </View>
      )}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {(wide() || tab() === 'Layers') && (
          <View style={wide() ? { width: 194 } : { flex: 1 }}>
            <Layers selected={selected()} onSelect={select} />
          </View>
        )}
        {(wide() || tab() === 'Canvas') &&
          (isolated() ? (
            <Scroll style={{ flex: 1 }} contentStyle={{ padding: 20, gap: 18 }}>
              <View style={{ alignSelf: 'flex-start' }}>
                <Control label="Back to canvas" onPress={() => isolated.set(false)} />
              </View>
              <Text style={{ color: ink, fontSize: 22, fontWeight: 'bold' }}>
                {components[selected()].name}
              </Text>
              <View
                style={{ padding: 16, maxWidth: 460, backgroundColor: panel, borderRadius: 12 }}
              >
                <Preview id={selected()} design={design()} previewID="isolated" />
              </View>
            </Scroll>
          ) : (
            <Graph selected={selected()} design={design()} onSelect={select} />
          ))}
        {(wide() || tab() === 'Inspector') && (
          <View style={wide() ? { width: 264 } : { flex: 1 }}>
            {loaded() && (
              <Inspector design={design()} selected={selected()} onEdit={edit} onFocus={isolate} />
            )}
          </View>
        )}
      </View>
      {status() ? <Text style={{ color: muted, padding: 9 }}>{status()}</Text> : null}
    </View>
  )
}

function Inspector(props: {
  design: Design
  selected: ComponentId
  onEdit: (design: Design) => void
  onFocus: () => void
}) {
  const component = () => components[props.selected]
  const appearance = () => appearanceFor(props.design, props.selected)
  const applyAppearance = (next: Partial<Appearance>) =>
    props.onEdit({
      ...props.design,
      overrides: {
        ...props.design.overrides,
        [props.selected]: { ...props.design.overrides[props.selected], ...next },
      },
    })
  const resetAppearance = () => {
    const overrides = { ...props.design.overrides }
    delete overrides[props.selected]
    props.onEdit({ ...props.design, overrides })
  }
  return (
    <Scroll style={{ flex: 1, backgroundColor: panel }} contentStyle={{ padding: 15, gap: 18 }}>
      <Text style={{ color: ink, fontSize: 18, fontWeight: 'bold' }}>Global tokens</Text>
      <ColorControl
        label="Brand color"
        color={props.design.brand}
        onApply={(brand) => props.onEdit({ ...props.design, brand })}
      />
      <Stepper
        label="Font size"
        value={props.design.fontSize}
        min={12}
        max={20}
        onChange={(fontSize) => props.onEdit({ ...props.design, fontSize })}
      />
      <View style={{ height: 1, backgroundColor: border }} />
      <View style={{ gap: 4 }}>
        <Text style={{ color: ink, fontSize: 18, fontWeight: 'bold' }}>{component().name}</Text>
        <Text style={{ color: muted, fontSize: 13 }}>{component().description}</Text>
      </View>
      <Control label="Isolate preview" onPress={props.onFocus} />
      <ColorControl
        label="Component color"
        color={appearance().color}
        onApply={(color) => applyAppearance({ color })}
      />
      <Stepper
        label="Radius"
        value={appearance().radius}
        min={0}
        max={24}
        onChange={(radius) => applyAppearance({ radius })}
      />
      <Control
        label="Reset appearance"
        disabled={!props.design.overrides[props.selected]}
        onPress={resetAppearance}
      />
    </Scroll>
  )
}

function Layers(props: { selected: ComponentId; onSelect: (id: ComponentId) => void }) {
  return (
    <Scroll style={{ flex: 1, backgroundColor: panel }} contentStyle={{ padding: 15, gap: 20 }}>
      <Text style={{ color: ink, fontSize: 18, fontWeight: 'bold' }}>Layers</Text>
      {levels.map((level) => (
        <View style={{ gap: 5 }}>
          <Caption>{level.name}</Caption>
          <Text style={{ color: muted, fontSize: 11, paddingLeft: 6 }}>{level.cluster}</Text>
          {level.cards.map((id) => (
            <View style={{ paddingLeft: 12 }}>
              <Control
                label={components[id].name}
                selected={props.selected === id}
                onPress={() => props.onSelect(id)}
              />
            </View>
          ))}
        </View>
      ))}
    </Scroll>
  )
}

function Graph(props: {
  selected: ComponentId
  design: Design
  onSelect: (id: ComponentId) => void
}) {
  const centers = signal<Partial<Record<ComponentId, number>>>({})
  let scroll: ScrollRef | null = null
  let viewport = { width: 0, height: 0 }
  let boardHeight = 690
  const fit = () => {
    if (!viewport.width) return
    const scale = Math.min(1, viewport.width / boardWidth, viewport.height / boardHeight)
    scroll?.zoomTo({ scale, x: boardWidth / 2, y: boardHeight / 2 })
  }
  const draw = (cx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!shadersAvailable()) {
      cx.fillStyle = '#494036'
      for (let x = 12; x < width; x += 24) {
        for (let y = 12; y < height; y += 24) cx.fillRect(x, y, 2, 2)
      }
    }
    cx.lineWidth = 2
    cx.strokeStyle = props.design.brand
    cx.globalAlpha = 0.55
    const points = centers()
    for (const [index, level] of levels.entries()) {
      const left = margin + index * (cardWidth + gutter)
      for (const id of level.cards) {
        for (const used of components[id].uses) {
          const from = points[used]
          const to = points[id]
          if (from === undefined || to === undefined) continue
          cx.beginPath()
          cx.moveTo(left - gutter, from)
          cx.bezierCurveTo(left - gutter / 2, from, left - gutter / 2, to, left, to)
          cx.stroke()
        }
      }
    }
  }
  return (
    <View style={{ flex: 1, minWidth: 0, backgroundColor: background }}>
      <View style={{ ...row, justifyContent: 'space-between', flexWrap: 'wrap', padding: 10 }}>
        <Caption>Scroll to pan · Pinch or Ctrl + scroll to zoom</Caption>
        <View style={row}>
          <Control label="Fit" onPress={fit} />
          <Control label="100%" onPress={() => scroll?.zoomTo({ scale: 1 })} />
        </View>
      </View>
      <Scroll
        testID="canvas"
        ref={(ref) => {
          scroll = ref
        }}
        onLayout={({ bounds }) => {
          viewport = bounds.size
        }}
        horizontal
        minimumZoomScale={0.2}
        maximumZoomScale={2.5}
        style={{ flex: 1 }}
      >
        <View
          onLayout={({ bounds }) => {
            boardHeight = bounds.size.height
          }}
          style={{
            flexDirection: 'row',
            width: boardWidth,
            minHeight: 690,
            padding: margin,
            gap: gutter,
            alignItems: 'flex-start',
          }}
        >
          {shadersAvailable() && <Shader source={gridSource} paused style={overlay} />}
          <Canvas style={overlay} draw={(cx, size) => draw(cx, size.width, size.height)} />
          {levels.map((level) => (
            <View style={{ width: cardWidth, gap: 16 }}>
              <View style={{ gap: 4 }}>
                <Text style={{ color: ink, fontSize: 22, fontWeight: 'bold' }}>{level.name}</Text>
                <Caption>{level.cluster}</Caption>
              </View>
              {level.cards.map((id) => (
                <View
                  onLayout={({ bounds }) => {
                    const center = margin + bounds.origin.y + bounds.size.height / 2
                    if (centers()[id] !== center)
                      centers.update((previous) => ({ ...previous, [id]: center }))
                  }}
                  style={{
                    padding: 12,
                    gap: 12,
                    borderRadius: 12,
                    backgroundColor: panel,
                    borderWidth: 1,
                    borderColor: props.selected === id ? props.design.brand : border,
                  }}
                >
                  <Control
                    label={components[id].name}
                    testID={`select-${id}`}
                    onPress={() => props.onSelect(id)}
                  />
                  <Preview id={id} design={props.design} previewID={`canvas-${id}`} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </Scroll>
    </View>
  )
}

function ColorControl(props: { label: string; color: string; onApply: (color: string) => void }) {
  const draft = signal(props.color)
  const apply = () => {
    if (isColor(draft())) props.onApply(draft())
  }
  effect(() => draft.set(props.color))
  return (
    <View style={{ gap: 5 }}>
      <Caption>{props.label}</Caption>
      <View style={row}>
        <View style={{ width: 22, height: 22, borderRadius: 5, backgroundColor: props.color }} />
        <Input
          accessibilityLabel={props.label}
          value={draft()}
          onChange={(event) => draft.set(event.value)}
          onSubmit={apply}
          maxLength={7}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            flex: 1,
            color: ink,
            backgroundColor: background,
            borderRadius: 7,
            padding: 8,
            minWidth: 84,
          }}
        />
        <Control
          label="Apply"
          disabled={!isColor(draft()) || draft() === props.color}
          onPress={apply}
        />
      </View>
    </View>
  )
}

function Stepper(props: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <View style={{ gap: 5 }}>
      <Caption>{props.label}</Caption>
      <View style={row}>
        <Control
          label={`− ${props.label}`}
          disabled={props.value === props.min}
          onPress={() => props.onChange(props.value - 1)}
        />
        <Text style={{ color: ink, minWidth: 24, textAlign: 'center' }}>{props.value}</Text>
        <Control
          label={`+ ${props.label}`}
          disabled={props.value === props.max}
          onPress={() => props.onChange(props.value + 1)}
        />
      </View>
    </View>
  )
}

function Caption(props: { children: string }) {
  return <Text style={{ color: muted, fontSize: 12, fontWeight: 600 }}>{props.children}</Text>
}

function Control(props: {
  label: string
  onPress: () => void
  disabled?: boolean
  selected?: boolean
  testID?: string
}) {
  return (
    <Button
      testID={props.testID}
      onPress={props.onPress}
      disabled={props.disabled}
      selected={props.selected}
      style={{
        paddingVertical: 9,
        paddingHorizontal: 10,
        backgroundColor: props.selected ? '#4b3326' : surface,
        borderRadius: 8,
        opacity: props.disabled ? 0.45 : 1,
      }}
      activeStyle={{ opacity: 0.65 }}
    >
      <Text style={{ color: ink, fontSize: 13 }}>{props.label}</Text>
    </Button>
  )
}

function wide() {
  return windowSize().width >= 950
}
