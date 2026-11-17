import { signal, Text, View } from 'nsh'
import type { JSX } from 'nsh/types'
import { Button, Dialog, Input, Switch } from 'nsh/base'
import { appearanceFor, type ComponentId, type Design } from './design'

export const ink = '#f2e9dc'
export const muted = '#afa59b'
export const border = '#443c34'
export const panel = '#211d19'
export const surface = '#2b2520'

export function Preview(props: { id: ComponentId; design: Design; previewID: string }) {
  return () => {
    switch (props.id) {
      case 'button':
        return <ButtonPreview design={props.design} />
      case 'input':
        return <Field design={props.design} placeholder="Type something" />
      case 'switch':
        return <Toggle design={props.design} />
      case 'invite':
        return <InviteForm design={props.design} />
      case 'access':
        return <AccessControls design={props.design} testID={`${props.previewID}-open`} />
      case 'settings':
        return (
          <PreviewGroup id="settings" design={props.design}>
            <Text style={{ color: ink, fontSize: props.design.fontSize + 2, fontWeight: 'bold' }}>
              Team workspace
            </Text>
            <InviteForm design={props.design} />
            <AccessControls design={props.design} testID={`${props.previewID}-open`} />
          </PreviewGroup>
        )
    }
  }
}

function InviteForm(props: { design: Design }) {
  const email = signal('')
  const result = signal('')
  return (
    <PreviewGroup id="invite" design={props.design}>
      <Text style={{ color: ink, fontWeight: 600, fontSize: props.design.fontSize }}>
        Invite a teammate
      </Text>
      <Field design={props.design} placeholder="Email address" onChange={email.set} />
      <Action
        design={props.design}
        label="Invite"
        onPress={() =>
          result.set(
            email().includes('@') ? `Preview invite for ${email()}` : 'Enter an email address',
          )
        }
      />
      {result() ? <Text style={{ color: muted }}>{result()}</Text> : null}
    </PreviewGroup>
  )
}

function AccessControls(props: { design: Design; testID: string }) {
  const open = signal(false)
  return (
    <PreviewGroup id="access" design={props.design}>
      <Toggle design={props.design} />
      <Action
        design={props.design}
        label="Open"
        onPress={() => open.set(true)}
        testID={props.testID}
      />
      <Dialog
        open={open()}
        accessibilityLabel="Access settings"
        animation="none"
        backdropStyle={{ backgroundColor: '#00000088' }}
        style={{
          backgroundColor: surface,
          padding: 20,
          borderRadius: 14,
          gap: 12,
          width: 300,
          maxWidth: '92%',
        }}
        onOpenChange={(event) => open.set(event.open)}
      >
        <Text style={{ color: ink, fontSize: 19, fontWeight: 'bold' }}>Access settings</Text>
        <Text style={{ color: muted }}>Workspace members can view shared projects.</Text>
        <Action design={props.design} label="Close" onPress={() => open.set(false)} />
      </Dialog>
    </PreviewGroup>
  )
}

function ButtonPreview(props: { design: Design }) {
  const count = signal(0)
  return (
    <Action
      design={props.design}
      label={`Run (${count()})`}
      onPress={() => count.update((value) => value + 1)}
    />
  )
}

function Action(props: { design: Design; label: string; onPress: () => void; testID?: string }) {
  const appearance = () => appearanceFor(props.design, 'button')
  return (
    <Button
      testID={props.testID}
      onPress={props.onPress}
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderWidth: 2,
        borderColor: appearance().color,
        borderRadius: appearance().radius,
      }}
      activeStyle={{ opacity: 0.65 }}
    >
      <Text style={{ color: ink, fontSize: props.design.fontSize, fontWeight: 600 }}>
        {props.label}
      </Text>
    </Button>
  )
}

function Field(props: { design: Design; placeholder: string; onChange?: (value: string) => void }) {
  const appearance = () => appearanceFor(props.design, 'input')
  return (
    <Input
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange?.(event.value)}
      style={{
        color: ink,
        placeholderColor: muted,
        fontSize: props.design.fontSize,
        backgroundColor: panel,
        borderColor: appearance().color,
        borderRadius: appearance().radius,
        borderWidth: 1,
        padding: 8,
      }}
    />
  )
}

function Toggle(props: { design: Design }) {
  const checked = signal(false)
  const appearance = () => appearanceFor(props.design, 'switch')
  return (
    <Switch
      accessibilityLabel="Notifications"
      checked={checked()}
      onChange={(event) => checked.set(event.checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      trackStyle={{
        backgroundColor: checked() ? appearance().color : '#494139',
        borderRadius: appearance().radius,
        width: 36,
        height: 22,
        padding: 3,
        justifyContent: 'center',
        alignItems: checked() ? 'flex-end' : 'flex-start',
      }}
      thumbStyle={{ backgroundColor: ink, borderRadius: 8, width: 16, height: 16 }}
    >
      <Text style={{ color: ink, fontSize: props.design.fontSize }}>Notifications</Text>
    </Switch>
  )
}

function PreviewGroup(props: { id: ComponentId; design: Design; children: JSX.Element }) {
  const appearance = () => appearanceFor(props.design, props.id)
  return (
    <View
      style={{
        gap: 10,
        padding: 10,
        borderRadius: appearance().radius,
        borderWidth: 1,
        borderColor: appearance().color,
      }}
    >
      {props.children}
    </View>
  )
}
