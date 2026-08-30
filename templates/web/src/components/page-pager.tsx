import { Flex, Link as ChakraLink, Text } from '@chakra-ui/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/ssr'
import { Link, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { ComponentIndex } from '../lib/pages'

type PageLink = {
  to: '/components/$index'
  params: { index: ComponentIndex }
  href: string
  label: string
}

export function PagePager(pages: readonly PageLink[]) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const index = pages.findIndex((page) => page.href === pathname)
  const page = pages[index]
  const prev = index > 0 ? pages[index - 1] : undefined
  const next = index >= 0 ? pages[index + 1] : undefined
  const total = String(pages.length).padStart(2, '0')
  const current = String(Math.max(index, 0) + 1).padStart(2, '0')

  return (
    <Flex
      align="center"
      borderColor="app.border"
      borderTopWidth="1px"
      gap="4"
      justify="space-between"
      pt="6"
    >
      {prev ? (
        <PagerLink label={prev.label} params={prev.params}>
          <CaretLeft size={12} weight="light" />
          {prev.label}
        </PagerLink>
      ) : (
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
          start
        </Text>
      )}
      <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
        {page ? `${current} / ${total}` : total}
      </Text>
      {next ? (
        <PagerLink label={next.label} params={next.params}>
          {next.label}
          <CaretRight size={12} weight="light" />
        </PagerLink>
      ) : (
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
          end
        </Text>
      )}
    </Flex>
  )
}

function PagerLink({
  params,
  label,
  children,
}: {
  params: { index: ComponentIndex }
  label: string
  children: ReactNode
}) {
  return (
    <ChakraLink asChild color="fg.muted" _hover={{ color: 'fg' }}>
      <Link aria-label={label} params={params} to="/components/$index">
        <Flex align="center" fontFamily="mono" fontSize="2xs" gap="2" letterSpacing="wide">
          {children}
        </Flex>
      </Link>
    </ChakraLink>
  )
}
