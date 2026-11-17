import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/react/dialog'
import { CloseButton } from './close-button'

export default function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger className="sdk-button">open</DialogTrigger>
      <DialogBackdrop className="sdk-backdrop" />
      <DialogContent className="sdk-overlay-dialog sdk-stack" data-design-component="dialog">
        <DialogTitle>dialog</DialogTitle>
        <DialogDescription>Review the changes before continuing.</DialogDescription>
        <DialogClose render={<CloseButton />} />
      </DialogContent>
    </Dialog>
  )
}
