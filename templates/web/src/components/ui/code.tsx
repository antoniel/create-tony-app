import { Code as ChakraCode, type CodeProps as ChakraCodeProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface CodeProps extends ChakraCodeProps {}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(props, ref) {
  return <ChakraCode ref={ref} bg="app.well" fontFamily="mono" {...props} />
})
