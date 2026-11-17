import { Resizable, ResizableHandle, ResizablePanel } from '@ui-sdk/react/resizable'

export default function Splitter() {
  return (
    <Resizable className="sdk-resizable" defaultLayout={[50, 50]}>
      <ResizablePanel className="sdk-panel" id="left" minSize={20}>
        Left
      </ResizablePanel>
      <ResizableHandle className="sdk-resize-handle" />
      <ResizablePanel className="sdk-panel" id="right" minSize={20}>
        Right
      </ResizablePanel>
    </Resizable>
  )
}
