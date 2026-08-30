import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface ButtonProps extends ChakraButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  return (
    <ChakraButton
      ref={ref}
      colorPalette="brand"
      css={{
        fontWeight: 'normal',
        letterSpacing: 'tight',
        '&[data-variant=solid]': {
          bg: { _light: 'brand.950', _dark: 'brand.50' },
          borderColor: 'transparent',
          color: { _light: 'brand.50', _dark: 'brand.950' },
        },
        '&[data-variant=outline]': {
          borderColor: 'app.border',
          color: 'fg',
        },
      }}
      {...props}
    />
  )
})
