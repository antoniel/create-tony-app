import { Spinner as ChakraSpinner, type SpinnerProps as ChakraSpinnerProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface SpinnerProps extends ChakraSpinnerProps {}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(props, ref) {
  return <ChakraSpinner ref={ref} color="fg" {...props} />
})
