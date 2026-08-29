import { Box, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { CaretRight, Cube, Faders, Plugs, StackSimple, Swatches } from '@phosphor-icons/react/ssr'
import { useEffect, useState } from 'react'

const nav = [
  {
    label: 'plate',
    icon: StackSimple,
    items: [{ to: '/', label: 'system', exact: true, spec: '01', icon: Swatches }],
  },
  {
    label: 'port',
    icon: Plugs,
    items: [
      { to: '/components', label: 'bits', spec: '02', icon: Cube },
      { to: '/theme', label: 'tune', spec: '03', icon: Faders },
    ],
  },
] as const

function itemActive(pathname: string, item: (typeof nav)[number]['items'][number]) {
  return 'exact' in item && item.exact ? pathname === item.to : pathname.startsWith(item.to)
}

function currentItem(pathname: string) {
  const items = nav.flatMap((group) => group.items)
  return items.find((item) => itemActive(pathname, item)) ?? items[0]
}

function IconMark({ icon: Glyph }: { icon: PhosphorIcon }) {
  return <Glyph size={14} weight="light" />
}

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current = currentItem(pathname)
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      nav.map((group) => [group.label, group.items.some((item) => itemActive(pathname, item))]),
    ),
  )

  useEffect(() => {
    setOpen((currentOpen) => {
      const next = { ...currentOpen }
      for (const group of nav) {
        if (group.items.some((item) => itemActive(pathname, item))) {
          next[group.label] = true
        }
      }
      return next
    })
  }, [pathname])

  return (
    <Flex
      as="aside"
      direction="column"
      flexShrink="0"
      gap="8"
      h="full"
      overflow="auto"
      px={collapsed ? '2' : '4'}
      py="4"
      w={collapsed ? '14' : '52'}
    >
      <Flex align="center" justify={collapsed ? 'center' : 'space-between'}>
        {collapsed ? null : (
          <ChakraLink asChild>
            <Link to="/">
              <Flex align="center" gap="3">
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.2em">
                  TONY
                </Text>
                <Box bg="blackAlpha.200" h="3" w="1px" />
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.14em">
                  {current.spec}
                </Text>
              </Flex>
            </Link>
          </ChakraLink>
        )}
        <Box
          as="button"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'open sidebar' : 'close sidebar'}
          bg="app.well"
          borderRadius="full"
          boxSize="8"
          cursor="pointer"
          p="1"
          shadow="md"
          type="button"
          onClick={onToggle}
        >
          <Box bg="app.accent" borderRadius="full" boxSize="full" />
        </Box>
      </Flex>

      <Stack gap="2">
        {nav.map((group) => {
          const expanded = open[group.label] ?? false
          const groupActive = group.items.some((item) => itemActive(pathname, item))

          if (collapsed) {
            return (
              <Stack gap="1" key={group.label}>
                {group.items.map((item) => {
                  const active = itemActive(pathname, item)
                  return (
                    <ChakraLink asChild key={item.to}>
                      <Link to={item.to}>
                        <Flex
                          align="center"
                          bg={active ? 'blackAlpha.100' : 'transparent'}
                          borderRadius="md"
                          color={active ? 'fg' : 'fg.muted'}
                          justify="center"
                          py="2"
                          _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
                        >
                          <IconMark icon={item.icon} />
                        </Flex>
                      </Link>
                    </ChakraLink>
                  )
                })}
              </Stack>
            )
          }

          return (
            <Stack gap="1" key={group.label}>
              <Flex
                as="button"
                align="center"
                aria-expanded={expanded}
                bg={groupActive && !expanded ? 'blackAlpha.100' : 'transparent'}
                borderRadius="md"
                color={groupActive ? 'fg' : 'fg.muted'}
                cursor="pointer"
                gap="2"
                px="2"
                py="1.5"
                type="button"
                w="full"
                _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
                onClick={() =>
                  setOpen((currentOpen) => ({ ...currentOpen, [group.label]: !expanded }))
                }
              >
                <IconMark icon={group.icon} />
                <Text flex="1" fontSize="sm" letterSpacing="-0.01em" textAlign="left">
                  {group.label}
                </Text>
                <Box
                  color="fg.muted"
                  transform={expanded ? 'rotate(90deg)' : 'none'}
                  transition="transform 0.15s ease"
                >
                  <CaretRight size={12} weight="light" />
                </Box>
              </Flex>

              {expanded ? (
                <Stack borderColor="blackAlpha.200" borderLeftWidth="1px" gap="0" ml="3.5" pl="3">
                  {group.items.map((item) => {
                    const active = itemActive(pathname, item)
                    return (
                      <ChakraLink asChild key={item.to}>
                        <Link to={item.to}>
                          <Flex
                            align="center"
                            bg={active ? 'blackAlpha.100' : 'transparent'}
                            borderRadius="md"
                            color={active ? 'fg' : 'fg.muted'}
                            fontSize="sm"
                            gap="2"
                            px="2"
                            py="1.5"
                            _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
                          >
                            <IconMark icon={item.icon} />
                            <Text flex="1" letterSpacing="-0.01em">
                              {item.label}
                            </Text>
                            <Text fontFamily="mono" fontSize="2xs" letterSpacing="0.08em">
                              {item.spec}
                            </Text>
                          </Flex>
                        </Link>
                      </ChakraLink>
                    )
                  })}
                </Stack>
              ) : null}
            </Stack>
          )
        })}
      </Stack>
    </Flex>
  )
}
