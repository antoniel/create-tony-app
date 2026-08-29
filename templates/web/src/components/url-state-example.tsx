import { Button, HStack, Text } from '@chakra-ui/react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

const views = ['overview', 'details'] as const

export function UrlStateExample() {
  const [view, setView] = useQueryState('view', parseAsStringLiteral(views).withDefault('overview'))

  return (
    <HStack gap="3" wrap="wrap">
      <Text color="fg.muted" fontFamily="mono" fontSize="2xs" letterSpacing="0.14em">
        FILTER
      </Text>
      {views.map((value) => (
        <Button
          colorPalette="brand"
          key={value}
          onClick={() => setView(value)}
          size="sm"
          variant={view === value ? 'solid' : 'outline'}
        >
          {value}
        </Button>
      ))}
    </HStack>
  )
}
