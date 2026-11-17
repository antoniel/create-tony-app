import { useState } from 'react'
import { CloseButton } from './close-button'
import { Button } from './button'

export default function Tag() {
  const [visible, setVisible] = useState(true)
  return visible ? (
    <span className="sdk-row sdk-badge" data-design-surface>
      Design <CloseButton aria-label="Remove tag" onClick={() => setVisible(false)} />
    </span>
  ) : (
    <Button onClick={() => setVisible(true)}>Add tag</Button>
  )
}
