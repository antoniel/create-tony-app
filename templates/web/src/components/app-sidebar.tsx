import { Box, Link as ChakraLink, Flex, Menu, Stack, Text } from '@chakra-ui/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CaretRight,
  Cube,
  Desktop,
  Faders,
  GearSix,
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

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Box
      as="button"
      aria-label={label}
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
      onClick={onClick}
    >
      {children}
    </Box>
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
      align="center"
      as="aside"
      direction="column"
      flexShrink="0"
      h="full"
      overflow="auto"
      py="2"
      w={collapsed ? '14' : '56'}
    >
      <Flex align="center" h="10" justify={collapsed ? 'center' : 'space-between'} px="3" w="full">
        {collapsed ? null : (
          <ChakraLink asChild>
            <Link to="/">
              <Flex align="center" gap="3" minW="0">
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="widest">
                  TONY
                </Text>
                <Box bg="blackAlpha.200" h="3" w="px" />
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
                  {current.spec}
                </Text>
              </Flex>
            </Link>
          </ChakraLink>
        )}
        <IconButton label={collapsed ? 'open sidebar' : 'close sidebar'} onClick={onToggle}>
          <SidebarSimple size={16} weight="light" />
        </IconButton>
      </Flex>

      <Stack align={collapsed ? 'center' : 'stretch'} flex="1" gap="1" py="4" w="full">
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
                        <Flex
                          align="center"
                          bg={active ? 'blackAlpha.100' : 'transparent'}
                          borderRadius="md"
                          color={active ? 'fg' : 'fg.muted'}
                          h="8"
                          justify="center"
                          w="8"
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
            <Stack gap="0" key={group.label} w="full">
              <Flex
                as="button"
                align="center"
                aria-expanded={expanded}
                bg={groupActive && !expanded ? 'blackAlpha.100' : 'transparent'}
                color={groupActive ? 'fg' : 'fg.muted'}
                cursor="pointer"
                gap="2"
                h="8"
                px="3"
                type="button"
                w="full"
                _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
                onClick={() =>
                  setOpen((currentOpen) => ({ ...currentOpen, [group.label]: !expanded }))
                }
              >
                <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
                  <IconMark icon={group.icon} />
                </Flex>
                <Text flex="1" fontSize="sm" letterSpacing="tight" textAlign="left">
                  {group.label}
                </Text>
                <Flex color="fg.muted" h="8" placeContent="center" placeItems="center" w="8">
                  <Box
                    transform={expanded ? 'rotate(90deg)' : 'none'}
                    transition="transform 0.15s ease"
                  >
                    <CaretRight size={12} weight="light" />
                  </Box>
                </Flex>
              </Flex>

              {expanded
                ? group.items.map((item) => {
                    const active = itemActive(pathname, item)
                    return (
                      <ChakraLink asChild display="block" key={item.to} w="full">
                        <Link to={item.to}>
                          <Flex
                            align="center"
                            bg={active ? 'blackAlpha.100' : 'transparent'}
                            color={active ? 'fg' : 'fg.muted'}
                            gap="2"
                            h="8"
                            pl="6"
                            pr="3"
                            w="full"
                            _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
                          >
                            <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
                              <IconMark icon={item.icon} />
                            </Flex>
                            <Text flex="1" fontSize="sm" letterSpacing="tight">
                              {item.label}
                            </Text>
                            <Text
                              flexShrink="0"
                              fontFamily="mono"
                              fontSize="2xs"
                              letterSpacing="wide"
                              textAlign="center"
                              w="8"
                            >
                              {item.spec}
                            </Text>
                          </Flex>
                        </Link>
                      </ChakraLink>
                    )
                  })
                : null}
            </Stack>
          )
        })}
      </Stack>

      <SetupMenu collapsed={collapsed} />
    </Flex>
  )
}

function SetupMenu({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const current = themeModes.find((mode) => mode.id === theme) ?? themeModes[2]

  return (
    <Menu.Root
      onSelect={(details) => setTheme(details.value)}
      positioning={{ placement: collapsed ? 'right-end' : 'top-start' }}
    >
      <Menu.Trigger asChild>
        {collapsed ? (
          <Box
            as="button"
            aria-label="setup"
            color="fg.muted"
            cursor="pointer"
            display="flex"
            h="10"
            placeContent="center"
            placeItems="center"
            type="button"
            w="full"
            _hover={{ color: 'fg' }}
          >
            <IconMark icon={GearSix} />
          </Box>
        ) : (
          <Flex
            as="button"
            align="center"
            color="fg.muted"
            cursor="pointer"
            gap="2"
            h="10"
            px="3"
            type="button"
            w="full"
            _hover={{ bg: 'blackAlpha.50', color: 'fg' }}
          >
            <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
              <IconMark icon={GearSix} />
            </Flex>
            <Text flex="1" fontSize="sm" letterSpacing="tight" textAlign="left">
              setup
            </Text>
            <Flex h="8" placeContent="center" placeItems="center" w="8">
              <IconMark icon={mounted ? current.icon : Desktop} />
            </Flex>
          </Flex>
        )}
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content bg="app.surface" borderColor="app.border" minW="40" p="1">
          <Text
            color="fg.muted"
            fontFamily="mono"
            fontSize="2xs"
            letterSpacing="wide"
            px="2"
            py="1.5"
          >
            theme
          </Text>
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
  )
}
