import { createMove, definePrimitive, type MoveDraft, type MovePoint } from '@ui-sdk/core'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@ui-sdk/react/popover'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from './button'
import { CloseButton } from './close-button'

const panelMove = definePrimitive({
  name: 'floating-preview-panel',
  state: (): { positions: Record<string, MovePoint>; draft: MoveDraft | null } => ({
    positions: { panel: { x: 0, y: 0 } },
    draft: null,
  }),
  live: ['draft'],
  api: (context) => ({
    move: createMove(context, {
      key: 'positions',
      draft: 'draft',
      step: () => 8,
      label: () => 'Display options',
      set(positions) {
        context.store.set({ positions })
        return true
      },
    }),
  }),
  slots: () => ({}),
})

export default function FloatingPanel() {
  const id = useId()
  const model = useRef<ReturnType<typeof panelMove> | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const instance = panelMove({ id })
    model.current = instance
    const unsubscribe = instance.subscribe(() => {
      const { positions, draft } = instance.get()
      setOffset({
        x: positions.panel.x + (draft?.dx ?? 0),
        y: positions.panel.y + (draft?.dy ?? 0),
      })
    })
    return () => {
      model.current = null
      unsubscribe()
      instance.destroy()
    }
  }, [id])

  return (
    <Popover container={document.body}>
      <PopoverTrigger className="sdk-button">Options panel</PopoverTrigger>
      <PopoverContent className="sdk-floating-positioner">
        <div className="sdk-popup sdk-stack" style={{ translate: `${offset.x}px ${offset.y}px` }}>
          <PopoverTitle>Display options</PopoverTitle>
          <div className="sdk-row">
            <Button
              className="sdk-drag-handle"
              aria-label="Reposition options panel"
              onPointerDown={(event) =>
                model.current?.api.move.pointerdown(event.nativeEvent, 'panel', event.currentTarget)
              }
              onKeyDown={(event) => model.current?.api.move.keydown(event.nativeEvent, 'panel')}
            >
              Drag to move
            </Button>
            <PopoverClose render={<CloseButton />} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
