import { Box, Link as ChakraLink, Flex, Menu, Stack, Text, Tooltip } from '@chakra-ui/react'
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
import { chassisImage } from '../theme/build'

const frameEase = 'width 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
const fadeEase = 'opacity 0.18s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
const railHit = {
  _hover: { bg: 'app.spot', color: 'fg' },
  _focusVisible: { bg: 'app.spot', color: 'fg' },
} as const

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

function RailTip({
  label,
  enabled,
  children,
}: {
  label: string
  enabled: boolean
  children: ReactNode
}) {
  return (
    <Tooltip.Root
      closeDelay={80}
      disabled={!enabled}
      openDelay={200}
      positioning={{ placement: 'right', gutter: 8 }}
    >
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          bg="app.surface"
          borderColor="app.border"
          borderWidth="1px"
          color="fg"
          fontFamily="mono"
          fontSize="2xs"
          letterSpacing="wide"
          px="2"
          py="1"
          shadow="xs"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
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
      as="aside"
      bgColor="app.bg"
      bgImage={chassisImage}
      mr="0.5"
      flexShrink="0"
      h="full"
      overflow="hidden"
      position="relative"
      py="2"
      transition={frameEase}
      w={collapsed ? '14' : '56'}
    >
      <Flex direction="column" h="full" minW="56" overflow="auto" w="56">
        <Flex align="center" h="10" justify="space-between" px="3" w="full">
          <ChakraLink asChild>
            <Link to="/">
              <Flex
                align="center"
                gap="3"
                minW="0"
                opacity={collapsed ? 0 : 1}
                pointerEvents={collapsed ? 'none' : 'auto'}
                transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
                transition={fadeEase}
              >
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="widest">
                  TONY
                </Text>
                <Box bg="app.border" h="3" w="px" />
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
                  {current.spec}
                </Text>
              </Flex>
            </Link>
          </ChakraLink>
          <Box flexShrink="0" w="8" />
        </Flex>

        <Stack flex="1" gap="1" py="4" w="full">
          {nav.map((group) => {
            const expanded = open[group.label] ?? false
            const groupActive = group.items.some((item) => itemActive(pathname, item))

            return (
              <Stack gap="0" key={group.label} w="full">
                <RailTip enabled={collapsed} label={group.label}>
                <Flex
                  as="button"
                  align="center"
                  aria-expanded={expanded}
                  aria-label={collapsed ? group.label : undefined}
                  bg={groupActive && !expanded ? 'app.spot' : 'transparent'}
                  color={groupActive ? 'fg' : 'fg.muted'}
                  cursor="pointer"
                  gap="2"
                  h="8"
                  px="3"
                  type="button"
                  w="full"
                  {...railHit}
                  onClick={() =>
                    setOpen((currentOpen) => ({ ...currentOpen, [group.label]: !expanded }))
                  }
                >
                  <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
                    <IconMark icon={group.icon} />
                  </Flex>
                  <Text
                    flex="1"
                    fontSize="sm"
                    letterSpacing="tight"
                    opacity={collapsed ? 0 : 1}
                    textAlign="left"
                    transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
                    transition={fadeEase}
                  >
                    {group.label}
                  </Text>
                  <Flex
                    color="fg.muted"
                    h="8"
                    opacity={collapsed ? 0 : 1}
                    placeContent="center"
                    placeItems="center"
                    transition={fadeEase}
                    w="8"
                  >
                    <Box
                      transform={expanded ? 'rotate(90deg)' : 'none'}
                      transition="transform 0.15s ease"
                    >
                      <CaretRight size={12} weight="light" />
                    </Box>
                  </Flex>
                </Flex>
                </RailTip>

                {expanded
                  ? group.items.map((item) => {
                      const active = itemActive(pathname, item)
                      return (
                        <ChakraLink asChild display="block" key={item.to} w="full">
                          <Link to={item.to}>
                            <Flex
                              align="center"
                              bg={active ? 'app.spot' : 'transparent'}
                              color={active ? 'fg' : 'fg.muted'}
                              gap="2"
                              h={collapsed ? '0' : '8'}
                              opacity={collapsed ? 0 : 1}
                              overflow="hidden"
                              pl="6"
                              pr="3"
                              transition={`${fadeEase}, height 0.32s cubic-bezier(0.16, 1, 0.3, 1)`}
                              w="full"
                              {...railHit}
                            >
                              <Flex
                                flexShrink="0"
                                h="8"
                                placeContent="center"
                                placeItems="center"
                                w="8"
                              >
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

      <Flex align="center" h="10" position="absolute" right="3" top="2">
        <RailTip enabled label={collapsed ? 'open' : 'close'}>
          <IconButton label={collapsed ? 'open sidebar' : 'close sidebar'} onClick={onToggle}>
            <SidebarSimple size={16} weight="light" />
          </IconButton>
        </RailTip>
      </Flex>
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
      <RailTip enabled={collapsed} label="setup">
      <Menu.Trigger asChild>
        <Flex
          as="button"
          align="center"
          aria-label={collapsed ? 'setup' : undefined}
          color="fg.muted"
          cursor="pointer"
          gap="2"
          h="10"
          px="3"
          type="button"
          w="full"
          {...railHit}
        >
          <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
            <IconMark icon={GearSix} />
          </Flex>
          <Text
            flex="1"
            fontSize="sm"
            letterSpacing="tight"
            opacity={collapsed ? 0 : 1}
            textAlign="left"
            transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
            transition={fadeEase}
          >
            setup
          </Text>
          <Flex
            h="8"
            opacity={collapsed ? 0 : 1}
            placeContent="center"
            placeItems="center"
            transition={fadeEase}
            w="8"
          >
            <IconMark icon={mounted ? current.icon : Desktop} />
          </Flex>
        </Flex>
      </Menu.Trigger>
      </RailTip>
      <Menu.Positioner>
        <Menu.Content bg="app.surface" borderColor="app.border" minW="40" p="1" shadow="sm">
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
                bg={active ? 'app.spot' : 'transparent'}
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
