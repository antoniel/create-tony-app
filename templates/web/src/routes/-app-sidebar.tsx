import {
  Box,
  Link as ChakraLink,
  Flex,
  Menu,
  Popover,
  Portal,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  CaretRight,
  Cube,
  Desktop,
  GearSix,
  Moon,
  SidebarSimple,
  SquaresFour,
  StackSimple,
  Sun,
  Swatches,
} from '@phosphor-icons/react/ssr'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { componentPages, componentTo, type ComponentIndex } from '../lib/pages'
import { chassisImage } from '../theme/build'
import { navRowProps } from './-nav-mark'

const frameEase = 'width 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
const fadeEase = 'opacity 0.18s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)'

const themeModes = [
  { id: 'light', label: 'light', icon: Sun },
  { id: 'dark', label: 'dark', icon: Moon },
  { id: 'system', label: 'system', icon: Desktop },
] as const

type NavItem = {
  href: string
  to: '/' | '/components' | '/components/$index'
  params?: { index: ComponentIndex }
  label: string
  spec: string
  icon: PhosphorIcon
  exact?: boolean
}

const nav: { label: string; icon: PhosphorIcon; items: NavItem[] }[] = [
  {
    label: 'plate',
    icon: StackSimple,
    items: [{ href: '/', to: '/' as const, label: 'system', exact: true as const, spec: '01', icon: Swatches }],
  },
  {
    label: 'components',
    icon: Cube,
    items: [
      { href: '/components', to: '/components' as const, label: 'all', exact: true as const, spec: '00', icon: SquaresFour },
      ...componentPages.map((page) => ({
        href: `/components/${page.index}`,
        to: '/components/$index' as const,
        params: componentTo(page.index).params,
        label: page.label,
        spec: page.spec,
        icon: Cube,
      })),
    ],
  },
]

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const spec = currentItem(pathname)?.spec ?? ''
  const [accordion, setAccordion] = useState<Record<string, boolean>>(savedAccordion)
  const [flyout, setFlyout] = useState<Record<string, boolean>>(savedFlyout)

  useEffect(() => {
    savedFlyout = closedRail()
    setFlyout(savedFlyout)
  }, [collapsed])

  const closeFlyout = () => {
    savedFlyout = closedRail()
    setFlyout(savedFlyout)
  }

  const toggleGroup = (label: string) => {
    if (collapsed) {
      savedFlyout = { ...closedRail(), [label]: !savedFlyout[label] }
      setFlyout(savedFlyout)
      return
    }
    savedAccordion = { ...savedAccordion, [label]: !savedAccordion[label] }
    setAccordion(savedAccordion)
  }

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
      <Flex
        direction="column"
        h="full"
        minW={collapsed ? '14' : '56'}
        overflowX="hidden"
        overflowY="auto"
        transition={frameEase}
        w={collapsed ? '14' : '56'}
      >
        <Flex align="center" h="10" justify="space-between" overflow="hidden" px="3" w="full">
          <ChakraLink asChild>
            <Link to="/">
              <Flex
                align="center"
                gap="3"
                minW="0"
                opacity={collapsed ? 0 : 1}
                overflow="hidden"
                pointerEvents={collapsed ? 'none' : 'auto'}
                transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
                transition={fadeEase}
                w={collapsed ? '0' : 'auto'}
              >
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="widest">
                  TONY
                </Text>
                <Box bg="app.border" h="3" w="px" />
                <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="wide">
                  {spec}
                </Text>
              </Flex>
            </Link>
          </ChakraLink>
          <Box flexShrink="0" overflow="hidden" w={collapsed ? '0' : '8'} />
        </Flex>

        <Stack flex="1" gap="1" py="4" w="full">
          {nav.map((group) => {
            const expanded = collapsed
              ? (flyout[group.label] ?? false)
              : (accordion[group.label] ?? false)
            const groupActive = group.items.some((item) => itemActive(pathname, item))

            const groupButton = (
              <Flex
                as="button"
                align="center"
                aria-expanded={expanded}
                aria-label={collapsed ? group.label : undefined}
                cursor="pointer"
                gap={collapsed ? '0' : '2'}
                h="8"
                overflow="hidden"
                px="3"
                w="full"
                {...navRowProps(false, groupActive)}
                onClick={() => toggleGroup(group.label)}
              >
                {collapsed ? (
                  <Popover.Anchor asChild>
                    <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
                      <IconMark icon={group.icon} />
                    </Flex>
                  </Popover.Anchor>
                ) : (
                    <IconMark icon={group.icon} />
                )}
                <Text
                  flex={collapsed ? '0' : '1'}
                  fontSize="sm"
                  letterSpacing="tight"
                  minW="0"
                  opacity={collapsed ? 0 : 1}
                  overflow="hidden"
                  textAlign="left"
                  transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
                  transition={fadeEase}
                  w={collapsed ? '0' : 'auto'}
                  whiteSpace="nowrap"
                >
                  {group.label}
                </Text>
                <Flex
                  color="fg.muted"
                  flexShrink="0"
                  h="8"
                  opacity={collapsed ? 0 : 1}
                  overflow="hidden"
                  placeContent="center"
                  placeItems="center"
                  transition={fadeEase}
                  w={collapsed ? '0' : '8'}
                >
                  <Box
                    transform={expanded ? 'rotate(90deg)' : 'none'}
                    transition="transform 0.15s ease"
                  >
                    <CaretRight size={12} weight="light" />
                  </Box>
                </Flex>
              </Flex>
            )

            return (
              <Stack gap="0" key={group.label} w="full">
                {collapsed ? (
                  <Popover.Root
                    autoFocus={false}
                    open={expanded}
                    onOpenChange={(details) => {
                      if (!details.open) {
                        closeFlyout()
                      }
                    }}
                    positioning={{
                      gutter: 12,
                      placement: 'right-start',
                      getAnchorRect: (el) => {
                        if (!el) {
                          return null
                        }
                        const rect = el.getBoundingClientRect()
                        return DOMRect.fromRect({
                          height: 0,
                          width: 0,
                          x: rect.right,
                          y: rect.top,
                        })
                      },
                    }}
                  >
                    <RailTip enabled={!expanded} label={group.label}>
                      <Popover.Trigger asChild>{groupButton}</Popover.Trigger>
                    </RailTip>
                    <Portal>
                      <Popover.Positioner>
                        <Popover.Content
                          bg="app.surface"
                          borderColor="app.highlight"
                          borderWidth="1px"
                          minW="44"
                          p="1"
                          shadow="sm"
                        >
                          <Text
                            color="fg.muted"
                            fontFamily="mono"
                            fontSize="2xs"
                            letterSpacing="wide"
                            px="3"
                            py="1.5"
                          >
                            {group.label}
                          </Text>
                          <GroupChildren
                            group={group}
                            inset={false}
                            onSelect={closeFlyout}
                            pathname={pathname}
                          />
                        </Popover.Content>
                      </Popover.Positioner>
                    </Portal>
                  </Popover.Root>
                ) : (
                  <>
                    {groupButton}
                    {expanded ? <GroupChildren group={group} inset pathname={pathname} /> : null}
                  </>
                )}
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

export function useRailCollapsed() {
  const [collapsed, setCollapsed] = useState(savedCollapsed)
  const setRailCollapsed = (next: boolean) => {
    savedCollapsed = next
    setCollapsed(next)
  }
  return [collapsed, setRailCollapsed] as const
}

function GroupChildren({
  group,
  inset,
  pathname,
  onSelect,
}: {
  group: (typeof nav)[number]
  inset: boolean
  pathname: string
  onSelect?: () => void
}) {
  return (
    <Stack
      alignSelf="stretch"
      borderColor="app.border"
      borderLeftWidth={inset ? '1px' : '0'}
      gap="0"
      minW="0"
      ml={inset ? '6' : '0'}
      overflow="hidden"
      w="auto"
    >
      {group.items.map((item) => {
        const active = itemActive(pathname, item)
        return (
          <ChakraLink asChild display="block" key={item.href} textDecoration="none" w="full">
            <Link
              params={'params' in item ? item.params : undefined}
              to={item.to}
              onClick={onSelect}
            >
              <Flex align="center" gap="2" h="8" pr="3" w="full" {...navRowProps(active)}>
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
      })}
    </Stack>
  )
}

function SetupMenu({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const trigger = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const current = themeModes.find((mode) => mode.id === theme) ?? themeModes[2]

  return (
    <Menu.Root
      onSelect={(details) => setTheme(details.value)}
      positioning={{
        gutter: 12,
        placement: 'right-end',
        getAnchorRect: () => trigger.current?.getBoundingClientRect() ?? null,
      }}
    >
      <Menu.Trigger asChild>
        <Flex
          as="button"
          ref={trigger}
          align="center"
          aria-label={collapsed ? 'setup' : undefined}
          cursor="pointer"
          gap={collapsed ? '0' : '2'}
          h="10"
          overflow="hidden"
          px="3"
          w="full"
          {...navRowProps(false)}
        >
          <RailTip enabled={collapsed} label="setup">
            <Flex flexShrink="0" h="8" placeContent="center" placeItems="center" w="8">
              <IconMark icon={GearSix} />
            </Flex>
          </RailTip>
          <Text
            flex={collapsed ? '0' : '1'}
            fontSize="sm"
            letterSpacing="tight"
            minW="0"
            opacity={collapsed ? 0 : 1}
            overflow="hidden"
            textAlign="left"
            transform={collapsed ? 'translateX(-0.5rem)' : 'none'}
            transition={fadeEase}
            w={collapsed ? '0' : 'auto'}
            whiteSpace="nowrap"
          >
            setup
          </Text>
          <Flex
            flexShrink="0"
            h="8"
            opacity={collapsed ? 0 : 1}
            overflow="hidden"
            placeContent="center"
            placeItems="center"
            transition={fadeEase}
            w={collapsed ? '0' : '8'}
          >
            <IconMark icon={mounted ? current.icon : Desktop} />
          </Flex>
        </Flex>
      </Menu.Trigger>
      <Portal>
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
      </Portal>
    </Menu.Root>
  )
}

function currentItem(pathname: string) {
  const items = nav.flatMap((group) => group.items)
  return items.find((item) => itemActive(pathname, item)) ?? items[0]
}

function itemActive(pathname: string, item: NavItem) {
  return 'exact' in item && item.exact ? pathname === item.href : pathname.startsWith(item.href)
}

function closedRail() {
  return Object.fromEntries(nav.map((group) => [group.label, false]))
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
      <Portal>
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
      </Portal>
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
      w="8"
      _hover={{ color: 'fg' }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}

let savedAccordion = closedRail()
let savedFlyout = closedRail()
let savedCollapsed = false
