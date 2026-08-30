import { Separator as ChakraSeparator, type SeparatorProps as ChakraSeparatorProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface SeparatorProps extends ChakraSeparatorProps {}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(props, ref) {
  return <ChakraSeparator ref={ref} borderColor="app.border" {...props} />
})
