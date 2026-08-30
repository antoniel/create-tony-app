import { Heading as ChakraHeading, type HeadingProps as ChakraHeadingProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface HeadingProps extends ChakraHeadingProps {}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(props, ref) {
  return <ChakraHeading ref={ref} fontWeight="normal" letterSpacing="tight" {...props} />
})
