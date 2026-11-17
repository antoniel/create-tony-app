import { Tooltip, TooltipContent, TooltipTrigger } from '@ui-sdk/react/tooltip'

export default function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger className="sdk-button">Hover</TooltipTrigger>
      <TooltipContent className="sdk-popup">The hint</TooltipContent>
    </Tooltip>
  )
}
