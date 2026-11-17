import { useState } from 'react'
import { Button } from './button'

export default function IconButton() {
  const [favorite, setFavorite] = useState(false)
  return (
    <Button aria-label="Favorite" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>
      {favorite ? '★' : '☆'}
    </Button>
  )
}
