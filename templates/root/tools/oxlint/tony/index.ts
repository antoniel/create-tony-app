import { eslintCompatPlugin } from '@oxlint/plugins'
import { topoDeclarationOrderRule } from './rules/topo-declaration-order.ts'

/** Workspace lint rules that encode how Tony files are shaped. */
const tonyPlugin = eslintCompatPlugin({
  meta: { name: 'tony' },
  rules: {
    'topo-declaration-order': topoDeclarationOrderRule,
  },
})

export default tonyPlugin
