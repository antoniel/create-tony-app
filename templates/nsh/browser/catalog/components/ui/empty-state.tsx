import { useState } from 'react'
import { Button } from './button'

export default function EmptyState() {
  const [items, setItems] = useState(0)
  return (
    <section className="sdk-panel sdk-stack">
      <strong>{items ? '1 item' : 'No items yet'}</strong>
      <Button onClick={() => setItems(items ? 0 : 1)}>{items ? 'Remove item' : 'Add item'}</Button>
    </section>
  )
}
