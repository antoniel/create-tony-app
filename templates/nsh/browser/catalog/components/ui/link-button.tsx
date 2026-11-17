import { Link } from '@tanstack/react-router'
import { Button } from './button'

export default function LinkButton() {
  return (
    <Button render={<Link to="/components" />} data-design-component="link-button">
      Browse components ↗
    </Button>
  )
}
