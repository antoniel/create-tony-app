import { Box, HStack, Stack, Text, createListCollection, parseColor } from '@chakra-ui/react'
import { Cube, MagnifyingGlass } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '../../components/ui/accordion'
import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from '../../components/ui/action-bar'
import { Alert } from '../../components/ui/alert'
import { Avatar, AvatarGroup } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Blockquote } from '../../components/ui/blockquote'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Button } from '../../components/ui/button'
import {
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from '../../components/ui/card'
import { CarouselControls, CarouselItem, CarouselItemGroup, CarouselRoot } from '../../components/ui/carousel'
import { Checkbox } from '../../components/ui/checkbox'
import { CheckboxCard } from '../../components/ui/checkbox-card'
import { ClipboardButton, ClipboardRoot } from '../../components/ui/clipboard'
import { CloseButton } from '../../components/ui/close-button'
import { Code } from '../../components/ui/code'
import {
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerInput,
  ColorPickerRoot,
  ColorPickerSliders,
  ColorPickerTrigger,
} from '../../components/ui/color-picker'
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
} from '../../components/ui/combobox'
import { DataListItem, DataListRoot } from '../../components/ui/data-list'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer'
import { EmptyState } from '../../components/ui/empty-state'
import { Field } from '../../components/ui/field'
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../../components/ui/file-upload'
import {
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelRoot,
  FloatingPanelTitle,
  FloatingPanelTrigger,
} from '../../components/ui/floating-panel'
import { Heading } from '../../components/ui/heading'
import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from '../../components/ui/hover-card'
import { IconButton } from '../../components/ui/icon-button'
import { Input } from '../../components/ui/input'
import { InputGroup } from '../../components/ui/input-group'
import { Kbd } from '../../components/ui/kbd'
import { LinkButton } from '../../components/ui/link-button'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../components/ui/menu'
import { NativeSelectField, NativeSelectRoot } from '../../components/ui/native-select'
import { NumberInputField, NumberInputRoot } from '../../components/ui/number-input'
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../../components/ui/pagination'
import { PasswordInput } from '../../components/ui/password-input'
import { PinInput } from '../../components/ui/pin-input'
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from '../../components/ui/popover'
import { ProgressBar, ProgressLabel, ProgressRoot } from '../../components/ui/progress'
import { ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText } from '../../components/ui/progress-circle'
import { Prose } from '../../components/ui/prose'
import { QrCode } from '../../components/ui/qr-code'
import { Radio, RadioGroup } from '../../components/ui/radio'
import { RadioCardItem, RadioCardRoot } from '../../components/ui/radio-card'
import { Rating } from '../../components/ui/rating'
import { SegmentedControl } from '../../components/ui/segmented-control'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { Skeleton, SkeletonText } from '../../components/ui/skeleton'
import { Slider } from '../../components/ui/slider'
import { Spinner } from '../../components/ui/spinner'
import { SplitterPanel, SplitterResizeTrigger, SplitterRoot } from '../../components/ui/splitter'
import { StatHelpText, StatLabel, StatRoot, StatValueText } from '../../components/ui/stat'
import { Status } from '../../components/ui/status'
import { StepperInput } from '../../components/ui/stepper-input'
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from '../../components/ui/steps'
import { Switch } from '../../components/ui/switch'
import { TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from '../../components/ui/table'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../../components/ui/tabs'
import { Tag } from '../../components/ui/tag'
import {
  TagsInputContext,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputRoot,
} from '../../components/ui/tags-input'
import { Textarea } from '../../components/ui/textarea'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from '../../components/ui/timeline'
import { toaster } from '../../components/ui/toaster'
import { Toggle } from '../../components/ui/toggle'
import { InfoTip } from '../../components/ui/toggle-tip'
import { Tooltip } from '../../components/ui/tooltip'
import type { ComponentIndex } from '../../lib/pages'

const frameworks = createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ],
})

const catalog = {
  accordion: {
    copy: 'show and hide related sections.',
    preview: (
      <AccordionRoot collapsible defaultValue={['one']} w="full">
        <AccordionItem value="one">
          <AccordionItemTrigger>one</AccordionItemTrigger>
          <AccordionItemContent>first plate.</AccordionItemContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionItemTrigger>two</AccordionItemTrigger>
          <AccordionItemContent>second plate.</AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    ),
  },
  'action-bar': {
    copy: 'bottom bar for a selected set.',
    preview: (
      <ActionBarRoot closeOnInteractOutside={false} open>
        <ActionBarContent portalled={false}>
          <ActionBarSelectionTrigger>2 selected</ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button size="sm">delete</Button>
          <ActionBarCloseTrigger />
        </ActionBarContent>
      </ActionBarRoot>
    ),
  },
  alert: {
    copy: 'state that needs to be seen.',
    preview: (
      <Alert status="info" title="synced">
        playground is live.
      </Alert>
    ),
  },
  avatar: {
    copy: 'face or initials.',
    preview: (
      <AvatarGroup>
        <Avatar name="Tony App" />
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
      </AvatarGroup>
    ),
  },
  badge: {
    copy: 'status, etched not stickered.',
    preview: (
      <HStack gap="3">
        <Badge variant="solid">solid</Badge>
        <Badge variant="outline">outline</Badge>
        <Badge variant="subtle">subtle</Badge>
      </HStack>
    ),
  },
  blockquote: {
    copy: 'quoted from elsewhere.',
    preview: <Blockquote cite="Tony">solid is steel. outline is a port.</Blockquote>,
  },
  breadcrumb: {
    copy: 'where you are in the tree.',
    preview: (
      <BreadcrumbRoot>
        <BreadcrumbLink href="/components">components</BreadcrumbLink>
        <BreadcrumbCurrentLink>breadcrumb</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
    ),
  },
  button: {
    copy: 'two fills. solid does the work.',
    preview: (
      <HStack gap="3">
        <Button variant="solid">solid</Button>
        <Button variant="outline">outline</Button>
        <Button loading variant="solid">
          wait
        </Button>
      </HStack>
    ),
  },
  card: {
    copy: 'one subject, one plate.',
    preview: (
      <CardRoot maxW="sm">
        <CardHeader>
          <CardTitle>card</CardTitle>
          <CardDescription>design lives here.</CardDescription>
        </CardHeader>
        <CardBody>
          <Text color="fg.muted">import from components/ui.</Text>
        </CardBody>
        <CardFooter>
          <Button size="sm">open</Button>
        </CardFooter>
      </CardRoot>
    ),
  },
  carousel: {
    copy: 'cycle through a set.',
    preview: (
      <CarouselRoot slideCount={3} w="full">
        <CarouselItemGroup>
          {[0, 1, 2].map((index) => (
            <CarouselItem index={index} key={index}>
              <Box bg="app.well" h="32" />
            </CarouselItem>
          ))}
        </CarouselItemGroup>
        <CarouselControls />
      </CarouselRoot>
    ),
  },
  checkbox: {
    copy: 'pick many.',
    preview: (
      <Stack>
        <Checkbox defaultChecked>alpha</Checkbox>
        <Checkbox>beta</Checkbox>
      </Stack>
    ),
  },
  'checkbox-card': {
    copy: 'pick many, as cards.',
    preview: (
      <HStack align="stretch" gap="3" w="full">
        <CheckboxCard defaultChecked description="primary" label="alpha" />
        <CheckboxCard description="spare" label="beta" />
      </HStack>
    ),
  },
  clipboard: {
    copy: 'copy to the system clipboard.',
    preview: (
      <ClipboardRoot value="https://tony.app">
        <ClipboardButton />
      </ClipboardRoot>
    ),
  },
  'close-button': {
    copy: 'dismiss a layer.',
    preview: <CloseButton />,
  },
  code: {
    copy: 'inline etch.',
    preview: (
      <Text>
        import from <Code>src/components/ui</Code>
      </Text>
    ),
  },
  'color-picker': {
    copy: 'pick a color.',
    preview: (
      <ColorPickerRoot defaultValue={parseColor('#C2410C')}>
        <ColorPickerControl>
          <ColorPickerTrigger />
          <ColorPickerInput />
        </ColorPickerControl>
        <ColorPickerContent>
          <ColorPickerArea />
          <ColorPickerSliders />
        </ColorPickerContent>
      </ColorPickerRoot>
    ),
  },
  combobox: {
    copy: 'type, then pick.',
    preview: (
      <ComboboxRoot collection={frameworks} width="56">
        <ComboboxControl>
          <ComboboxInput placeholder="search" />
        </ComboboxControl>
        <ComboboxContent>
          {frameworks.items.map((item) => (
            <ComboboxItem item={item} key={item.value}>
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </ComboboxRoot>
    ),
  },
  'data-list': {
    copy: 'label and value pairs.',
    preview: (
      <DataListRoot>
        <DataListItem label="stack" value="chakra" />
        <DataListItem info="lives in the file" label="design" value="component" />
      </DataListRoot>
    ),
  },
  dialog: {
    copy: 'modal plate.',
    preview: (
      <DialogRoot>
        <DialogTrigger asChild>
          <Button variant="outline">open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>dialog</DialogTitle>
          </DialogHeader>
          <DialogBody>design stays in the component.</DialogBody>
          <DialogFooter>
            <Button>done</Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    ),
  },
  drawer: {
    copy: 'slides in from the side.',
    preview: (
      <DrawerRoot>
        <DrawerTrigger asChild>
          <Button variant="outline">open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>side plate.</DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    ),
  },
  'empty-state': {
    copy: 'nothing here yet.',
    preview: (
      <EmptyState description="add a component from ui." icon={<Cube />} title="empty">
        <Button size="sm" variant="outline">
          add
        </Button>
      </EmptyState>
    ),
  },
  field: {
    copy: 'label, help, error.',
    preview: (
      <Field helperText="used as the login" label="email">
        <Input placeholder="you@tony.app" />
      </Field>
    ),
  },
  'file-upload': {
    copy: 'drop or pick a file.',
    preview: (
      <FileUploadRoot>
        <FileUploadDropzone description="png, jpg up to 5mb" label="drop files" />
        <FileUploadList />
      </FileUploadRoot>
    ),
  },
  'floating-panel': {
    copy: 'draggable layer above the page.',
    preview: (
      <FloatingPanelRoot>
        <FloatingPanelTrigger asChild>
          <Button variant="outline">open</Button>
        </FloatingPanelTrigger>
        <FloatingPanelContent>
          <FloatingPanelTitle>panel</FloatingPanelTitle>
          <FloatingPanelBody>floats over the plate.</FloatingPanelBody>
        </FloatingPanelContent>
      </FloatingPanelRoot>
    ),
  },
  heading: {
    copy: 'the plate title.',
    preview: <Heading size="2xl">Tony</Heading>,
  },
  'hover-card': {
    copy: 'content on hover.',
    preview: (
      <HoverCardRoot>
        <HoverCardTrigger asChild>
          <Button variant="outline">hover</Button>
        </HoverCardTrigger>
        <HoverCardContent p="4">preview without a click.</HoverCardContent>
      </HoverCardRoot>
    ),
  },
  'icon-button': {
    copy: 'action, no label.',
    preview: (
      <HStack gap="3">
        <IconButton aria-label="search" variant="solid">
          <MagnifyingGlass />
        </IconButton>
        <IconButton aria-label="search" variant="outline">
          <MagnifyingGlass />
        </IconButton>
      </HStack>
    ),
  },
  input: {
    copy: 'one line in.',
    preview: <Input maxW="xs" placeholder="type" />,
  },
  'input-group': {
    copy: 'input with addons.',
    preview: (
      <InputGroup endAddon=".app" startElement={<MagnifyingGlass />} w="xs">
        <Input placeholder="search" />
      </InputGroup>
    ),
  },
  kbd: {
    copy: 'a key on the board.',
    preview: (
      <HStack gap="2">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </HStack>
    ),
  },
  'link-button': {
    copy: 'button that is a link.',
    preview: (
      <LinkButton href="/components/button" variant="outline">
        button
      </LinkButton>
    ),
  },
  menu: {
    copy: 'choose from a list.',
    preview: (
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="outline">open</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="copy">copy</MenuItem>
          <MenuItem value="paste">paste</MenuItem>
        </MenuContent>
      </MenuRoot>
    ),
  },
  'native-select': {
    copy: 'the platform select.',
    preview: (
      <NativeSelectRoot width="48">
        <NativeSelectField items={['react', 'vue', 'svelte']} placeholder="stack" />
      </NativeSelectRoot>
    ),
  },
  'number-input': {
    copy: 'a number, with steppers.',
    preview: (
      <NumberInputRoot defaultValue="12" maxW="36" min={0}>
        <NumberInputField />
      </NumberInputRoot>
    ),
  },
  pagination: {
    copy: 'move through pages.',
    preview: (
      <PaginationRoot count={48} pageSize={8} siblingCount={1}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    ),
  },
  'password-input': {
    copy: 'secret, with a reveal.',
    preview: <PasswordInput maxW="xs" />,
  },
  'pin-input': {
    copy: 'one character per slot.',
    preview: <PinInput count={4} />,
  },
  popover: {
    copy: 'a small plate on click.',
    preview: (
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button variant="outline">open</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <PopoverTitle>popover</PopoverTitle>
            <Text color="fg.muted" pt="2">
              stays near the trigger.
            </Text>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    ),
  },
  progress: {
    copy: 'how far along.',
    preview: (
      <ProgressRoot defaultValue={64} w="full">
        <ProgressLabel>upload</ProgressLabel>
        <ProgressBar />
      </ProgressRoot>
    ),
  },
  'progress-circle': {
    copy: 'the same, as a ring.',
    preview: (
      <ProgressCircleRoot size="md" value={64}>
        <ProgressCircleRing cap="round" />
        <ProgressCircleValueText />
      </ProgressCircleRoot>
    ),
  },
  prose: {
    copy: 'remote html, styled.',
    preview: (
      <Prose>
        <h2>prose</h2>
        <p>long copy from elsewhere.</p>
      </Prose>
    ),
  },
  'qr-code': {
    copy: 'encode a string.',
    preview: <QrCode size="md" value="https://tony.app" />,
  },
  radio: {
    copy: 'pick one.',
    preview: (
      <RadioGroup defaultValue="one">
        <HStack gap="6">
          <Radio value="one">one</Radio>
          <Radio value="two">two</Radio>
        </HStack>
      </RadioGroup>
    ),
  },
  'radio-card': {
    copy: 'pick one, as cards.',
    preview: (
      <RadioCardRoot defaultValue="one">
        <HStack align="stretch">
          <RadioCardItem description="primary" label="one" value="one" />
          <RadioCardItem description="spare" label="two" value="two" />
        </HStack>
      </RadioCardRoot>
    ),
  },
  rating: {
    copy: 'stars for a score.',
    preview: <Rating defaultValue={4} />,
  },
  'segmented-control': {
    copy: 'one choice from a line.',
    preview: <SegmentedControl defaultValue="day" items={['day', 'week', 'month']} />,
  },
  select: {
    copy: 'pick from a list.',
    preview: (
      <SelectRoot collection={frameworks} size="sm" width="48">
        <SelectTrigger>
          <SelectValueText placeholder="stack" />
        </SelectTrigger>
        <SelectContent>
          {frameworks.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    ),
  },
  separator: {
    copy: 'a hairline between things.',
    preview: (
      <Stack w="full">
        <Text>above</Text>
        <Separator />
        <Text>below</Text>
      </Stack>
    ),
  },
  skeleton: {
    copy: 'placeholder while it loads.',
    preview: (
      <Stack w="xs">
        <Skeleton height="8" />
        <SkeletonText noOfLines={2} />
      </Stack>
    ),
  },
  slider: {
    copy: 'a value on a track.',
    preview: <Slider defaultValue={[40]} maxW="xs" />,
  },
  spinner: {
    copy: 'still working.',
    preview: <Spinner />,
  },
  splitter: {
    copy: 'drag to resize panes.',
    preview: (
      <SplitterRoot defaultSize={[40, 60]} h="36" panels={[{ id: 'a' }, { id: 'b' }]} w="full">
        <SplitterPanel id="a">
          <Box bg="app.well" h="full" />
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b" />
        <SplitterPanel id="b">
          <Box bg="app.spot" h="full" />
        </SplitterPanel>
      </SplitterRoot>
    ),
  },
  stat: {
    copy: 'a number with a name.',
    preview: (
      <StatRoot>
        <StatLabel>users</StatLabel>
        <StatValueText>1,204</StatValueText>
        <StatHelpText>this week</StatHelpText>
      </StatRoot>
    ),
  },
  status: {
    copy: 'a live state.',
    preview: (
      <HStack gap="4">
        <Status value="success">live</Status>
        <Status value="warning">hold</Status>
        <Status value="error">down</Status>
      </HStack>
    ),
  },
  'stepper-input': {
    copy: 'plus and minus around a number.',
    preview: <StepperInput defaultValue="3" min={0} />,
  },
  steps: {
    copy: 'a sequence.',
    preview: (
      <StepsRoot count={3} defaultStep={1} w="full">
        <StepsList>
          <StepsItem index={0} title="one" />
          <StepsItem index={1} title="two" />
          <StepsItem index={2} title="three" />
        </StepsList>
        <StepsContent index={0}>first</StepsContent>
        <StepsContent index={1}>second</StepsContent>
        <StepsContent index={2}>third</StepsContent>
        <HStack>
          <StepsPrevTrigger asChild>
            <Button size="sm" variant="outline">
              back
            </Button>
          </StepsPrevTrigger>
          <StepsNextTrigger asChild>
            <Button size="sm">next</Button>
          </StepsNextTrigger>
        </HStack>
      </StepsRoot>
    ),
  },
  switch: {
    copy: 'on or off.',
    preview: <Switch defaultChecked>alerts</Switch>,
  },
  table: {
    copy: 'rows and columns.',
    preview: (
      <TableRoot size="sm">
        <TableHeader>
          <TableRow>
            <TableColumnHeader>name</TableColumnHeader>
            <TableColumnHeader>role</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>ada</TableCell>
            <TableCell>math</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>grace</TableCell>
            <TableCell>code</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    ),
  },
  tabs: {
    copy: 'one panel at a time.',
    preview: (
      <TabsRoot defaultValue="one" w="full">
        <TabsList>
          <TabsTrigger value="one">one</TabsTrigger>
          <TabsTrigger value="two">two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">first plate.</TabsContent>
        <TabsContent value="two">second plate.</TabsContent>
      </TabsRoot>
    ),
  },
  tag: {
    copy: 'a small label.',
    preview: (
      <HStack gap="3">
        <Tag>chakra</Tag>
        <Tag closable>closable</Tag>
      </HStack>
    ),
  },
  'tags-input': {
    copy: 'many values, as tags.',
    preview: (
      <TagsInputRoot defaultValue={['chakra', 'tony']} maxW="xs">
        <TagsInputControl>
          <TagsInputContext>
            {(api) =>
              api.value.map((item, index) => (
                <TagsInputItem index={index} key={item} value={item}>
                  {item}
                </TagsInputItem>
              ))
            }
          </TagsInputContext>
          <TagsInputInput placeholder="add" />
        </TagsInputControl>
      </TagsInputRoot>
    ),
  },
  textarea: {
    copy: 'more than one line.',
    preview: <Textarea maxW="md" placeholder="write" rows={3} />,
  },
  timeline: {
    copy: 'events in order.',
    preview: (
      <TimelineRoot>
        <TimelineItem>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle>created</TimelineTitle>
            <TimelineDescription>the first commit.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle>shipped</TimelineTitle>
            <TimelineDescription>the first build.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </TimelineRoot>
    ),
  },
  toaster: {
    copy: 'a short message, then gone.',
    preview: (
      <Button
        variant="outline"
        onClick={() =>
          toaster.create({
            title: 'saved',
            description: 'the plate is written.',
          })
        }
      >
        toast
      </Button>
    ),
  },
  toggle: {
    copy: 'pressed or not.',
    preview: <Toggle>bold</Toggle>,
  },
  'toggle-tip': {
    copy: 'looks like a tooltip, acts like a popover.',
    preview: <InfoTip>more on click.</InfoTip>,
  },
  tooltip: {
    copy: 'a hint on hover.',
    preview: (
      <Tooltip content="the hint">
        <Button variant="outline">hover</Button>
      </Tooltip>
    ),
  },
} satisfies Record<ComponentIndex, { copy: string; preview: ReactNode }>

export function catalogEntry(index: ComponentIndex) {
  return catalog[index]
}

export function catalogPreview(index: ComponentIndex) {
  return catalog[index].preview
}
