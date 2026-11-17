import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@ui-sdk/react/popover'
import { CloseButton } from './close-button'

export default function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger className="sdk-button">Details</PopoverTrigger>
      <PopoverContent className="sdk-popup sdk-stack">
        <PopoverTitle>Details</PopoverTitle>
        <PopoverDescription>The popover stays anchored to its trigger.</PopoverDescription>
        <PopoverClose render={<CloseButton />} />
      </PopoverContent>
    </Popover>
  )
}
