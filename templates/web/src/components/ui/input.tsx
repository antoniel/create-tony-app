import { Input as ChakraInput, type InputProps as ChakraInputProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface InputProps extends ChakraInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return (
    <ChakraInput
      ref={ref}
      bg="app.bg"
      borderColor="app.border"
      css={{ _focusVisible: { borderColor: 'app.focus', outline: 'none' } }}
      {...props}
    />
  )
})
