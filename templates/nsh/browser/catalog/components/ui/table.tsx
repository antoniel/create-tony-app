export default function Table() {
  return (
    <table className="sdk-table" data-design-surface>
      <caption>Releases</caption>
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">v1.0</th>
          <td>Released</td>
        </tr>
        <tr>
          <th scope="row">v1.1</th>
          <td>Draft</td>
        </tr>
      </tbody>
    </table>
  )
}
