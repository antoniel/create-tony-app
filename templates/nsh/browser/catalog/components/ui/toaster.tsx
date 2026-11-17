import { toast } from '@ui-sdk/react/toast'
import { Button } from './button'

export default function Toaster() {
  return (
    <Button onClick={() => toast({ title: 'Saved', description: 'Your design was saved.' })}>
      toast
    </Button>
  )
}
