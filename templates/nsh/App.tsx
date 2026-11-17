import { host, mount, platform, signal, Storage, Text, View } from 'nsh'
import { readDesign, storageKey } from './design'
import { NativeStudio } from './NativeStudio'

function App() {
  return platform.os === 'web' && host.available() ? <WebStudio /> : <NativeStudio />
}

function WebStudio() {
  const error = signal('')
  let started = false
  const start = () => {
    if (started) return
    started = true
    void Storage.getItem(storageKey)
      .catch(() => null)
      .then((saved) => host.call('studio.mount', saved === null ? null : readDesign(saved)))
      .catch((reason: Error) => error.set(reason.message))
  }
  return (
    <View accessibilityLabel="Tony Studio web mount" style={{ flex: 1 }} onLayout={start}>
      {error() ? <Text>{error()}</Text> : null}
    </View>
  )
}

mount(App)
