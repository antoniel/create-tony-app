import { Code } from './code'
import { Heading } from './heading'

export default function Prose() {
  return (
    <article className="sdk-stack">
      <Heading>Getting started</Heading>
      <p>
        Run <Code>bun dev</Code> to open the workspace.
      </p>
      <ul>
        <li>Choose a component</li>
        <li>Edit its appearance</li>
      </ul>
    </article>
  )
}
