import { Heading, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export function DocsSection({
  kicker,
  title,
  copy,
  children,
}: {
  kicker: string
  title: string
  copy: string
  children: ReactNode
}) {
  return (
    <Stack gap="6">
      <Stack gap="2" maxW="2xl">
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.16em">
          {kicker}
        </Text>
        <Heading fontSize="xl" fontWeight="400">
          {title}
        </Heading>
        <Text color="fg.muted">{copy}</Text>
      </Stack>
      {children}
    </Stack>
  )
}
