import { useState } from 'react'
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@ui-sdk/react/menu'

export default function MenuExample() {
  const [action, setAction] = useState('Actions')
  return (
    <Menu>
      <MenuTrigger className="sdk-button">{action}</MenuTrigger>
      <MenuContent className="sdk-popup">
        <MenuItem className="sdk-option" onClick={() => setAction('Copied')}>
          Copy
        </MenuItem>
        <MenuItem className="sdk-option" onClick={() => setAction('Renamed')}>
          Rename
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
