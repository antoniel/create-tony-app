import { defineRule } from '@oxlint/plugins'
import type { ESTree } from '@oxlint/plugins'
import { misplacedDecls, type RankedDecl } from '../shared/topo-order.ts'

type FunctionLike = ESTree.ArrowFunctionExpression | ESTree.Function | ESTree.Class

type ModuleDecl = RankedDecl & {
  node: ESTree.Node
}

const TYPE_ONLY = new Set([
  'TSTypeAnnotation',
  'TSTypeParameterDeclaration',
  'TSTypeParameterInstantiation',
  'TSTypeAliasDeclaration',
  'TSInterfaceDeclaration',
  'TSModuleDeclaration',
  'TSEnumDeclaration',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNode(value: unknown): value is ESTree.Node {
  return isRecord(value) && typeof value.type === 'string'
}

function walk(value: unknown, visit: (node: ESTree.Node) => void, skip: (node: ESTree.Node) => boolean) {
  if (Array.isArray(value)) {
    for (const item of value) {
      walk(item, visit, skip)
    }
    return
  }
  if (!isNode(value)) {
    return
  }
  if (skip(value) || TYPE_ONLY.has(value.type)) {
    return
  }
  visit(value)
  for (const [key, child] of Object.entries(value)) {
    if (key === 'parent') {
      continue
    }
    walk(child, visit, skip)
  }
}

function isFunctionInit(node: ESTree.Node | null | undefined): node is FunctionLike {
  return (
    node?.type === 'ArrowFunctionExpression' ||
    node?.type === 'FunctionExpression' ||
    node?.type === 'FunctionDeclaration' ||
    node?.type === 'ClassDeclaration' ||
    node?.type === 'ClassExpression'
  )
}

function bindingNames(node: ESTree.Node | null | undefined): string[] {
  if (!node) {
    return []
  }
  if (node.type === 'Identifier') {
    return [node.name]
  }
  if (node.type === 'RestElement') {
    return bindingNames(node.argument)
  }
  if (node.type === 'AssignmentPattern') {
    return bindingNames(node.left)
  }
  if (node.type === 'TSParameterProperty') {
    return bindingNames(node.parameter)
  }
  if (node.type === 'ArrayPattern') {
    return node.elements.flatMap((element) => bindingNames(element))
  }
  if (node.type === 'ObjectPattern') {
    return node.properties.flatMap((property) => {
      if (property.type === 'RestElement') {
        return bindingNames(property.argument)
      }
      return bindingNames(property.value)
    })
  }
  return []
}

function nestedBindings(root: ESTree.Node): Set<string> {
  const names = new Set<string>()
  walk(
    root,
    (node) => {
      if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
        if (node !== root && node.id) {
          names.add(node.id.name)
        }
        return
      }
      if (node.type === 'VariableDeclarator') {
        for (const name of bindingNames(node.id)) {
          names.add(name)
        }
      }
    },
    (node) => node !== root && TYPE_ONLY.has(node.type),
  )
  if (root.type === 'FunctionDeclaration' || root.type === 'FunctionExpression' || root.type === 'ArrowFunctionExpression') {
    for (const param of root.params) {
      for (const name of bindingNames(param)) {
        names.add(name)
      }
    }
  }
  if (root.type === 'ClassDeclaration' || root.type === 'ClassExpression') {
    if (root.id) {
      names.add(root.id.name)
    }
  }
  return names
}

function isDefinitionId(node: ESTree.Identifier, parent: ESTree.Node | null): boolean {
  if (!parent) {
    return false
  }
  if (
    (parent.type === 'FunctionDeclaration' ||
      parent.type === 'FunctionExpression' ||
      parent.type === 'ClassDeclaration' ||
      parent.type === 'ClassExpression') &&
    parent.id === node
  ) {
    return true
  }
  if (parent.type === 'VariableDeclarator' && parent.id === node) {
    return true
  }
  if (parent.type === 'Property' && parent.key === node && !parent.computed && !parent.shorthand) {
    return true
  }
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) {
    return true
  }
  if (parent.type === 'MetaProperty') {
    return true
  }
  return false
}

function identifierName(node: ESTree.Node): string | null {
  if (node.type === 'Identifier') {
    return node.name
  }
  if (node.type === 'JSXIdentifier') {
    return node.name
  }
  return null
}

function localRefs(root: ESTree.Node, locals: ReadonlySet<string>): string[] {
  const shadowed = nestedBindings(root)
  const found = new Set<string>()
  walk(
    root,
    (node) => {
      const name = identifierName(node)
      if (!name || !locals.has(name) || shadowed.has(name)) {
        return
      }
      if (node.type === 'Identifier' && isDefinitionId(node, node.parent)) {
        return
      }
      found.add(name)
    },
    (node) => node !== root && (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') && node.id !== null && locals.has(node.id.name),
  )
  return [...found].sort()
}

function unwrapExported(statement: ESTree.ProgramStatement): {
  declaration: ESTree.Node | null
  exported: boolean
  specifiers: ESTree.ExportSpecifier[]
  defaultName: string | null
} {
  if (statement.type === 'ExportNamedDeclaration' && !statement.source) {
    return {
      declaration: statement.declaration,
      exported: statement.declaration !== null && statement.exportKind !== 'type',
      specifiers: statement.exportKind === 'type' ? [] : statement.specifiers,
      defaultName: null,
    }
  }
  if (statement.type === 'ExportDefaultDeclaration') {
    const decl = statement.declaration
    if (decl.type === 'Identifier') {
      return { declaration: null, exported: false, specifiers: [], defaultName: decl.name }
    }
    return { declaration: decl, exported: true, specifiers: [], defaultName: null }
  }
  return { declaration: statement, exported: false, specifiers: [], defaultName: null }
}

function functionUnits(
  declaration: ESTree.Node,
  exported: boolean,
  index: number,
): Array<{ name: string; node: ESTree.Node; exported: boolean; index: number; root: ESTree.Node }> {
  if (declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') {
    if (declaration.declare) {
      return []
    }
    return [
      {
        name: declaration.id?.name ?? 'default',
        node: declaration,
        exported,
        index,
        root: declaration,
      },
    ]
  }
  if (declaration.type === 'FunctionExpression' || declaration.type === 'ArrowFunctionExpression' || declaration.type === 'ClassExpression') {
    return [
      {
        name: 'id' in declaration && declaration.id ? declaration.id.name : 'default',
        node: declaration,
        exported,
        index,
        root: declaration,
      },
    ]
  }
  if (declaration.type !== 'VariableDeclaration') {
    return []
  }
  const units: Array<{ name: string; node: ESTree.Node; exported: boolean; index: number; root: ESTree.Node }> = []
  for (const declarator of declaration.declarations) {
    if (declarator.id.type !== 'Identifier' || !isFunctionInit(declarator.init)) {
      continue
    }
    units.push({
      name: declarator.id.name,
      node: declarator,
      exported,
      index,
      root: declarator.init,
    })
  }
  return units
}

function moduleFunctionDecls(program: ESTree.Program): ModuleDecl[] {
  const collected: Array<{ name: string; node: ESTree.Node; exported: boolean; index: number; root: ESTree.Node }> = []
  const exportedNames = new Set<string>()

  for (const [index, statement] of program.body.entries()) {
    const unwrapped = unwrapExported(statement)
    for (const specifier of unwrapped.specifiers) {
      if (specifier.local.type === 'Identifier') {
        exportedNames.add(specifier.local.name)
      }
    }
    if (unwrapped.defaultName) {
      exportedNames.add(unwrapped.defaultName)
    }
    if (!unwrapped.declaration) {
      continue
    }
    collected.push(...functionUnits(unwrapped.declaration, unwrapped.exported, index))
  }

  const unique: typeof collected = []
  const seen = new Set<string>()
  for (const unit of collected) {
    if (seen.has(unit.name)) {
      continue
    }
    seen.add(unit.name)
    unique.push(unit)
  }

  const locals = new Set(unique.map((unit) => unit.name))
  return unique.map((unit) => ({
    name: unit.name,
    exported: unit.exported || exportedNames.has(unit.name),
    deps: localRefs(unit.root, locals).filter((name) => name !== unit.name),
    index: unit.index,
    node: unit.node,
  }))
}

/** Module functions: exports first, then callers, then leaves. */
export const topoDeclarationOrderRule = defineRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Keep module functions in reverse topological order: exports first, then local callers, then leaves.',
    },
    messages: {
      outOfOrder:
        '`{{name}}` should appear after `{{after}}`. Exported functions first, then local callers, then leaves.',
    },
  },
  createOnce(context) {
    return {
      Program(program) {
        const decls = moduleFunctionDecls(program)
        if (decls.length < 2) {
          return
        }
        const byName = new Map(decls.map((decl) => [decl.name, decl]))
        for (const misplaced of misplacedDecls(decls)) {
          const node = byName.get(misplaced.name)?.node
          if (!node) {
            continue
          }
          context.report({
            node,
            messageId: 'outOfOrder',
            data: misplaced,
          })
        }
      },
    }
  },
})
