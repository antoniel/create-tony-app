import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export function PageIntro({
  spec,
  title,
  maxW = '2xl',
  children,
}: {
  spec: string
  title: string
  maxW?: string
  children?: ReactNode
}) {
  return (
    <Stack gap="4" maxW={maxW}>
      <Flex align="center" h="10">
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
          {spec}
        </Text>
      </Flex>
      <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="normal" lineHeight="plate">
        {title}
      </Heading>
      {children}
    </Stack>
  )
}

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
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
          {kicker}
        </Text>
        <Heading fontSize="xl" fontWeight="normal">
          {title}
        </Heading>
        <Text color="fg.muted">{copy}</Text>
      </Stack>
      {children}
    </Stack>
  )
}
