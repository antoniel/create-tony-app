import { Box, Link as ChakraLink, Flex, Menu, Stack, Text } from '@chakra-ui/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CaretRight,
  Cube,
  Desktop,
  Faders,
  Moon,
  Plugs,
  SidebarSimple,
  StackSimple,
  Sun,
  Swatches,
} from '@phosphor-icons/react/ssr'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTheme } from 'next-themes'
import { useEffect, useState, type ReactNode } from 'react'

const themeModes = [
  { id: 'light', label: 'light', icon: Sun },
  { id: 'dark', label: 'dark', icon: Moon },
  { id: 'system', label: 'system', icon: Desktop },
] as const

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
  return <Glyph size={16} weight="light" />
}

function NavHit({
  active,
  children,
  collapsed,
}: {
  active: boolean
  children: ReactNode
  collapsed: boolean
}) {
  return (
    <Flex
      align="center"
      bg={active ? 'blackAlpha.100' : 'transparent'}
      borderRadius="md"
      boxSize={collapsed ? '8' : undefined}
      color={active ? 'fg' : 'fg.muted'}
      fontSize="sm"
      gap="2"
      justify={collapsed ? 'center' : 'flex-start'}
      px={collapsed ? '0' : '2'}
      py={collapsed ? '0' : '1.5'}
      w={collapsed ? '8' : 'full'}
      _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
    >
      {children}
    </Flex>
  )
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
      align={collapsed ? 'center' : 'stretch'}
      as="aside"
      direction="column"
      flexShrink="0"
      gap="8"
      h="full"
      overflow="auto"
      px={collapsed ? '0' : '4'}
      py="2"
      w={collapsed ? '12' : '52'}
    >
      <Flex align="center" gap="3" justify={collapsed ? 'center' : 'space-between'} px={collapsed ? '0' : '2'} w="full">
        {collapsed ? null : (
          <ChakraLink asChild>
            <Link to="/">
              <Flex align="center" gap="3" minW="0">
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
          color="fg.muted"
          cursor="pointer"
          display="flex"
          flexShrink="0"
          h="8"
          placeContent="center"
          placeItems="center"
          type="button"
          w="8"
          _hover={{ color: 'fg' }}
          onClick={onToggle}
        >
          <SidebarSimple size={16} weight="light" />
        </Box>
      </Flex>

      <Stack align={collapsed ? 'center' : 'stretch'} gap="2" w="full">
        {nav.map((group) => {
          const expanded = open[group.label] ?? false
          const groupActive = group.items.some((item) => itemActive(pathname, item))

          if (collapsed) {
            return (
              <Stack align="center" gap="1" key={group.label}>
                {group.items.map((item) => {
                  const active = itemActive(pathname, item)
                  return (
                    <ChakraLink asChild key={item.to}>
                      <Link to={item.to}>
                        <NavHit active={active} collapsed>
                          <IconMark icon={item.icon} />
                        </NavHit>
                      </Link>
                    </ChakraLink>
                  )
                })}
              </Stack>
            )
          }

          return (
            <Stack gap="1" key={group.label} w="full">
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
                          <NavHit active={active} collapsed={false}>
                            <IconMark icon={item.icon} />
                            <Text flex="1" letterSpacing="-0.01em">
                              {item.label}
                            </Text>
                            <Text fontFamily="mono" fontSize="2xs" letterSpacing="0.08em">
                              {item.spec}
                            </Text>
                          </NavHit>
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

      <ThemeToggle collapsed={collapsed} />
    </Flex>
  )
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const current = themeModes.find((mode) => mode.id === theme) ?? themeModes[2]

  return (
    <Flex justify="center" mt="auto" w="full">
      <Menu.Root
        onSelect={(details) => setTheme(details.value)}
        positioning={{ placement: collapsed ? 'right-end' : 'top' }}
      >
        <Menu.Trigger asChild>
          <Box
            as="button"
            aria-label="theme"
            color="fg.muted"
            cursor="pointer"
            display="flex"
            h="8"
            placeContent="center"
            placeItems="center"
            type="button"
            w="8"
            _hover={{ color: 'fg' }}
          >
            <IconMark icon={mounted ? current.icon : Desktop} />
          </Box>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content bg="app.surface" borderColor="app.border" minW="36" p="1">
            {themeModes.map((mode) => {
              const active = mounted && theme === mode.id
              return (
                <Menu.Item
                  bg={active ? 'blackAlpha.100' : 'transparent'}
                  color={active ? 'fg' : 'fg.muted'}
                  gap="2"
                  key={mode.id}
                  value={mode.id}
                >
                  <IconMark icon={mode.icon} />
                  <Text fontSize="sm">{mode.label}</Text>
                </Menu.Item>
              )
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Flex>
  )
}
