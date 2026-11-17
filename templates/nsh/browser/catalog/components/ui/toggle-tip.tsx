import { Popover, PopoverContent, PopoverTrigger } from '@ui-sdk/react/popover'

export default function ToggleTip() {
  return (
    <Popover>
      <PopoverTrigger className="sdk-button" aria-label="More information">
        ⓘ
      </PopoverTrigger>
      <PopoverContent className="sdk-popup">More on click.</PopoverContent>
    </Popover>
  )
}
