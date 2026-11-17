import type { ComponentType } from 'react'
import type { ComponentIndex } from '../../lib/pages'
import AccordionPreview from '../../components/ui/accordion'
import ActionBarPreview from '../../components/ui/action-bar'
import AlertPreview from '../../components/ui/alert'
import AvatarPreview from '../../components/ui/avatar'
import BadgePreview from '../../components/ui/badge'
import BlockquotePreview from '../../components/ui/blockquote'
import BreadcrumbPreview from '../../components/ui/breadcrumb'
import ButtonPreview from '../../components/ui/button'
import CardPreview from '../../components/ui/card'
import CarouselPreview from '../../components/ui/carousel'
import CheckboxPreview from '../../components/ui/checkbox'
import CheckboxCardPreview from '../../components/ui/checkbox-card'
import ClipboardPreview from '../../components/ui/clipboard'
import CloseButtonPreview from '../../components/ui/close-button'
import CodePreview from '../../components/ui/code'
import ColorPickerPreview from '../../components/ui/color-picker'
import ComboboxPreview from '../../components/ui/combobox'
import DataListPreview from '../../components/ui/data-list'
import DialogPreview from '../../components/ui/dialog'
import DrawerPreview from '../../components/ui/drawer'
import EmptyStatePreview from '../../components/ui/empty-state'
import FieldPreview from '../../components/ui/field'
import FileUploadPreview from '../../components/ui/file-upload'
import FloatingPanelPreview from '../../components/ui/floating-panel'
import HeadingPreview from '../../components/ui/heading'
import HoverCardPreview from '../../components/ui/hover-card'
import IconButtonPreview from '../../components/ui/icon-button'
import InputPreview from '../../components/ui/input'
import InputGroupPreview from '../../components/ui/input-group'
import KbdPreview from '../../components/ui/kbd'
import LinkButtonPreview from '../../components/ui/link-button'
import MenuPreview from '../../components/ui/menu'
import NativeSelectPreview from '../../components/ui/native-select'
import NumberInputPreview from '../../components/ui/number-input'
import PaginationPreview from '../../components/ui/pagination'
import PasswordInputPreview from '../../components/ui/password-input'
import PinInputPreview from '../../components/ui/pin-input'
import PopoverPreview from '../../components/ui/popover'
import ProgressPreview from '../../components/ui/progress'
import ProgressCirclePreview from '../../components/ui/progress-circle'
import ProsePreview from '../../components/ui/prose'
import QrCodePreview from '../../components/ui/qr-code'
import RadioPreview from '../../components/ui/radio'
import RadioCardPreview from '../../components/ui/radio-card'
import RatingPreview from '../../components/ui/rating'
import SegmentedControlPreview from '../../components/ui/segmented-control'
import SelectPreview from '../../components/ui/select'
import SeparatorPreview from '../../components/ui/separator'
import SkeletonPreview from '../../components/ui/skeleton'
import SliderPreview from '../../components/ui/slider'
import SpinnerPreview from '../../components/ui/spinner'
import SplitterPreview from '../../components/ui/splitter'
import StatPreview from '../../components/ui/stat'
import StatusPreview from '../../components/ui/status'
import StepperInputPreview from '../../components/ui/stepper-input'
import StepsPreview from '../../components/ui/steps'
import SwitchPreview from '../../components/ui/switch'
import TablePreview from '../../components/ui/table'
import TabsPreview from '../../components/ui/tabs'
import TagPreview from '../../components/ui/tag'
import TagsInputPreview from '../../components/ui/tags-input'
import TextareaPreview from '../../components/ui/textarea'
import TimelinePreview from '../../components/ui/timeline'
import ToasterPreview from '../../components/ui/toaster'
import TogglePreview from '../../components/ui/toggle'
import ToggleTipPreview from '../../components/ui/toggle-tip'
import TooltipPreview from '../../components/ui/tooltip'

const previews = {
  accordion: AccordionPreview,
  'action-bar': ActionBarPreview,
  alert: AlertPreview,
  avatar: AvatarPreview,
  badge: BadgePreview,
  blockquote: BlockquotePreview,
  breadcrumb: BreadcrumbPreview,
  button: ButtonPreview,
  card: CardPreview,
  carousel: CarouselPreview,
  checkbox: CheckboxPreview,
  'checkbox-card': CheckboxCardPreview,
  clipboard: ClipboardPreview,
  'close-button': CloseButtonPreview,
  code: CodePreview,
  'color-picker': ColorPickerPreview,
  combobox: ComboboxPreview,
  'data-list': DataListPreview,
  dialog: DialogPreview,
  drawer: DrawerPreview,
  'empty-state': EmptyStatePreview,
  field: FieldPreview,
  'file-upload': FileUploadPreview,
  'floating-panel': FloatingPanelPreview,
  heading: HeadingPreview,
  'hover-card': HoverCardPreview,
  'icon-button': IconButtonPreview,
  input: InputPreview,
  'input-group': InputGroupPreview,
  kbd: KbdPreview,
  'link-button': LinkButtonPreview,
  menu: MenuPreview,
  'native-select': NativeSelectPreview,
  'number-input': NumberInputPreview,
  pagination: PaginationPreview,
  'password-input': PasswordInputPreview,
  'pin-input': PinInputPreview,
  popover: PopoverPreview,
  progress: ProgressPreview,
  'progress-circle': ProgressCirclePreview,
  prose: ProsePreview,
  'qr-code': QrCodePreview,
  radio: RadioPreview,
  'radio-card': RadioCardPreview,
  rating: RatingPreview,
  'segmented-control': SegmentedControlPreview,
  select: SelectPreview,
  separator: SeparatorPreview,
  skeleton: SkeletonPreview,
  slider: SliderPreview,
  spinner: SpinnerPreview,
  splitter: SplitterPreview,
  stat: StatPreview,
  status: StatusPreview,
  'stepper-input': StepperInputPreview,
  steps: StepsPreview,
  switch: SwitchPreview,
  table: TablePreview,
  tabs: TabsPreview,
  tag: TagPreview,
  'tags-input': TagsInputPreview,
  textarea: TextareaPreview,
  timeline: TimelinePreview,
  toaster: ToasterPreview,
  toggle: TogglePreview,
  'toggle-tip': ToggleTipPreview,
  tooltip: TooltipPreview,
} satisfies Record<ComponentIndex, ComponentType>

export function catalogPreview(index: ComponentIndex) {
  const Preview = previews[index]
  return (
    <div className="sdk-preview" data-design-component={index}>
      <Preview />
    </div>
  )
}
