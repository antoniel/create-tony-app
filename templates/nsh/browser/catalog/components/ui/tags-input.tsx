import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
} from '@ui-sdk/react/token-input'
import { useState } from 'react'

export default function TagsInput() {
  const [controller] = useState(createTokenInputController)
  return (
    <div className="sdk-stack">
      <span>Tags</span>
      <TokenInput
        controller={controller}
        renderToken={(token) => (
          <TokenInputToken className="sdk-badge">{token.label}</TokenInputToken>
        )}
        onSubmit={(parts) =>
          controller.setValue(
            parts.flatMap((part) => {
              if (part !== String(part)) return [part]
              return part
                .trim()
                .split(/[\s,]+/)
                .filter(Boolean)
                .map((label) => ({ type: 'tag', label, value: label }))
            }),
          )
        }
      >
        <TokenInputEditor
          aria-label="Tags"
          className="sdk-input"
          placeholder="Type a tag then press Enter"
        />
      </TokenInput>
    </div>
  )
}
