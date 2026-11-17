export default function NativeSelect() {
  return (
    <label className="sdk-stack">
      Region
      <select className="sdk-input" defaultValue="br">
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="jp">Japan</option>
      </select>
    </label>
  )
}
