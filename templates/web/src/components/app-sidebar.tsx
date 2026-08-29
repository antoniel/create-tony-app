import { Box, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { Link, useRouterState } from '@tanstack/react-router'

const nav = [
  {
    label: 'catalog',
    items: [{ to: '/', label: 'design system', exact: true, sku: 'ds-01' }],
  },
  {
    label: 'modules',
    items: [
      { to: '/components', label: 'components', sku: 'ui-02' },
      { to: '/theme', label: 'theme editor', sku: 'th-03' },
    ],
  },
] as const

function currentItem(pathname: string) {
  const items = nav.flatMap((group) => group.items)
  return (
    items.find((item) => ('exact' in item && item.exact ? pathname === item.to : pathname.startsWith(item.to))) ??
    items[0]
  )
}

export function AppTopBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current = currentItem(pathname)

  return (
    <Flex
      align="center"
      borderBottomWidth="1px"
      borderColor="app.border"
      justify="space-between"
      px="5"
      py="3"
    >
      <ChakraLink asChild>
        <Link to="/">
          <Text fontFamily="mono" fontSize="2xs" fontWeight="500" letterSpacing="0.22em">
            TONY
          </Text>
        </Link>
      </ChakraLink>
      <Flex align="center" gap="3">
        <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.12em">
          {current.sku}
        </Text>
        <Box bg="app.accent" borderRadius="full" boxSize="2" />
      </Flex>
    </Flex>
  )
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <Box
      as="aside"
      bg="app.well"
      bgImage="radial-gradient(circle, rgba(255,255,255,0.07) 0.6px, transparent 0.7px)"
      bgSize="5px 5px"
      borderBottomWidth={{ base: '1px', md: '0' }}
      borderColor="blackAlpha.400"
      borderRightWidth={{ base: '0', md: '1px' }}
      flexShrink="0"
      px="5"
      py="6"
      w={{ base: 'full', md: '56' }}
    >
      <Stack gap="8">
        {nav.map((group) => (
          <Stack gap="3" key={group.label}>
            <Text color="whiteAlpha.400" fontFamily="mono" fontSize="2xs" letterSpacing="0.18em">
              {group.label}
            </Text>
            <Stack gap="1">
              {group.items.map((item) => {
                const active = 'exact' in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to)
                return (
                  <ChakraLink asChild key={item.to}>
                    <Link to={item.to}>
                      <Flex
                        align="center"
                        color={active ? 'white' : 'whiteAlpha.600'}
                        fontSize="sm"
                        gap="3"
                        justify="space-between"
                        py="1.5"
                        _hover={{ color: 'white' }}
                      >
                        <Flex align="center" gap="2.5">
                          <Box
                            bg={active ? 'app.accent' : 'transparent'}
                            borderRadius="full"
                            boxSize="1.5"
                          />
                          <Text fontWeight="500" letterSpacing="-0.02em">
                            {item.label}
                          </Text>
                        </Flex>
                        <Text fontFamily="mono" fontSize="2xs" opacity="0.4">
                          {item.sku}
                        </Text>
                      </Flex>
                    </Link>
                  </ChakraLink>
                )
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
