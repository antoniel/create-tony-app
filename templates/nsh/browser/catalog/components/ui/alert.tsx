import Status from './status'

export default function Alert() {
  return (
    <div className="sdk-panel" role="status">
      <Status>Synced</Status>
      <p>Your design is up to date.</p>
    </div>
  )
}
