import { useState } from 'react'
import { Toolbar, ToolbarButton } from '@ui-sdk/react/toolbar'
import { CloseButton } from './close-button'

export default function ActionBar() {
  const [selected, setSelected] = useState(true)
  return selected ? (
    <Toolbar className="sdk-row sdk-panel" aria-label="Selected items">
      <span>2 selected</span>
      <ToolbarButton className="sdk-button" onClick={() => setSelected(false)}>
        Clear
      </ToolbarButton>
      <CloseButton onClick={() => setSelected(false)} />
    </Toolbar>
  ) : (
    <Toolbar className="sdk-row" aria-label="Selection">
      <ToolbarButton className="sdk-button" onClick={() => setSelected(true)}>
        Select items
      </ToolbarButton>
    </Toolbar>
  )
}
