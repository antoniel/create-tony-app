import { Box, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { Link, useRouterState } from '@tanstack/react-router'

const nav = [
  {
    label: 'Catalog',
    items: [{ to: '/', label: 'Design system', exact: true, sku: 'DS-01' }],
  },
  {
    label: 'Modules',
    items: [{ to: '/components', label: 'Components', sku: 'UI-02' }],
  },
] as const

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <Box
      as="aside"
      bg="app.surface"
      borderBottomWidth={{ base: '1px', md: '0' }}
      borderColor="app.border"
      borderRightWidth={{ base: '0', md: '1px' }}
      px="5"
      py="6"
      w={{ base: 'full', md: '64' }}
    >
      <Stack gap="10">
        <ChakraLink asChild>
          <Link to="/">
            <Stack gap="2">
              <Text fontSize="lg" fontWeight="500" letterSpacing="-0.04em">
                TONY
              </Text>
              <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.14em">
                STORE / SYS
              </Text>
            </Stack>
          </Link>
        </ChakraLink>
        {nav.map((group) => (
          <Stack gap="3" key={group.label}>
            <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.14em">
              {group.label.toUpperCase()}
            </Text>
            <Stack gap="0">
              {group.items.map((item) => {
                const active = 'exact' in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to)
                return (
                  <ChakraLink asChild key={item.to}>
                    <Link to={item.to}>
                      <Flex
                        align="center"
                        bg={active ? 'fg' : 'transparent'}
                        color={active ? 'app.bg' : 'fg.muted'}
                        fontSize="sm"
                        justify="space-between"
                        px="3"
                        py="2.5"
                        _hover={{ bg: active ? 'fg' : 'app.bg', color: active ? 'app.bg' : 'fg' }}
                      >
                        <Text fontWeight="500">{item.label}</Text>
                        <Text fontFamily="mono" fontSize="2xs">
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
