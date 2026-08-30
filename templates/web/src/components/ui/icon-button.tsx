import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface IconButtonProps extends ChakraIconButtonProps {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  props,
  ref,
) {
  return (
    <ChakraIconButton
      ref={ref}
      colorPalette="brand"
      css={{
        '&[data-variant=solid]': {
          bg: { _light: 'brand.950', _dark: 'brand.50' },
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
