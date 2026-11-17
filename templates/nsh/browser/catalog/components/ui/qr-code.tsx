import qrcode from 'qrcode-generator'
const qr = qrcode(0, 'M')
qr.addData('https://ui-sdk.dev/')
qr.make()
const size = qr.getModuleCount()
const modules = Array.from({ length: size }, (_, y) =>
  Array.from({ length: size }, (_, x) => (qr.isDark(y, x) ? `M${x},${y}h1v1h-1z` : '')).join(''),
).join('')

export default function QrCode() {
  return (
    <svg
      className="sdk-qr"
      data-design-surface
      role="img"
      aria-label="QR code for ui-sdk.dev"
      viewBox={`-4 -4 ${size + 8} ${size + 8}`}
    >
      <path d={modules} />
    </svg>
  )
}
