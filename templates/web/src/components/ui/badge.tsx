import { Badge as ChakraBadge, type BadgeProps as ChakraBadgeProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface BadgeProps extends ChakraBadgeProps {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  return (
    <ChakraBadge
      ref={ref}
      colorPalette="brand"
      css={{
        '&[data-variant=solid]': {
          bg: { _light: 'brand.950', _dark: 'brand.50' },
          color: { _light: 'brand.50', _dark: 'brand.950' },
        },
      }}
      {...props}
    />
  )
})
