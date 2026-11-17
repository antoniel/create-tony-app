import { useState } from 'react'
import { Button } from './button'
import { Heading } from './heading'

export default function Card() {
  const [saved, setSaved] = useState(false)
  return (
    <article className="sdk-panel sdk-stack" data-design-surface>
      <Heading>Release notes</Heading>
      <p>Review the latest design changes.</p>
      <Button onClick={() => setSaved(!saved)}>{saved ? 'Saved' : 'Save'}</Button>
    </article>
  )
}
