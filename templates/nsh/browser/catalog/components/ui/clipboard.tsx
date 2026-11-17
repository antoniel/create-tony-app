import { useState } from 'react'
import { Button } from './button'
import { Code } from './code'

export default function Clipboard() {
  const [message, setMessage] = useState('Copy')
  const snippet = 'bun dev'
  function copy() {
    if (!navigator.clipboard) {
      setMessage('Copy unavailable')
      return
    }
    void navigator.clipboard.writeText(snippet).then(
      () => setMessage('Copied'),
      () => setMessage('Copy unavailable'),
    )
  }
  return (
    <div className="sdk-row">
      <Code>{snippet}</Code>
      <Button onClick={copy}>{message}</Button>
    </div>
  )
}
