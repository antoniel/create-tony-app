import { Kbd as ChakraKbd, type KbdProps as ChakraKbdProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface KbdProps extends ChakraKbdProps {}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(props, ref) {
  return <ChakraKbd ref={ref} fontFamily="mono" {...props} />
})
