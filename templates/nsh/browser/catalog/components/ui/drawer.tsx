import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@ui-sdk/react/drawer'
import { CloseButton } from './close-button'

export default function DrawerPreview() {
  return (
    <Drawer side="right">
      <DrawerTrigger className="sdk-button">open</DrawerTrigger>
      <DrawerBackdrop className="sdk-backdrop" />
      <DrawerContent className="sdk-overlay-drawer sdk-stack" data-design-component="drawer">
        <DrawerTitle>drawer</DrawerTitle>
        <DrawerDescription>Settings stay in reach while you work.</DrawerDescription>
        <DrawerClose render={<CloseButton />} />
      </DrawerContent>
    </Drawer>
  )
}
