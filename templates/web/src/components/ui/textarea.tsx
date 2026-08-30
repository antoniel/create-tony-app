import { Textarea as ChakraTextarea, type TextareaProps as ChakraTextareaProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface TextareaProps extends ChakraTextareaProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref) {
  return (
    <ChakraTextarea
      ref={ref}
      bg="app.bg"
      borderColor="app.border"
      css={{ _focusVisible: { borderColor: 'app.focus', outline: 'none' } }}
      {...props}
    />
  )
})
