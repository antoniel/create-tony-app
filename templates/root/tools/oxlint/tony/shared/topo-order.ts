export type RankedDecl = {
  name: string
  exported: boolean
  deps: readonly string[]
  index: number
}

export type MisplacedDecl = {
  name: string
  after: string
}

export function reachableNames(
  name: string,
  depsByName: ReadonlyMap<string, readonly string[]>,
): Set<string> {
  const seen = new Set<string>()
  const stack = [...(depsByName.get(name) ?? [])]
  while (stack.length > 0) {
    const next = stack.pop()
    if (!next || seen.has(next)) {
      continue
    }
    seen.add(next)
    for (const child of depsByName.get(next) ?? []) {
      stack.push(child)
    }
  }
  return seen
}

export function compareDecls(
  left: RankedDecl,
  right: RankedDecl,
  reach: (name: string) => ReadonlySet<string>,
): number {
  if (left.exported !== right.exported) {
    return left.exported ? -1 : 1
  }
  const leftCallsRight = reach(left.name).has(right.name)
  const rightCallsLeft = reach(right.name).has(left.name)
  if (leftCallsRight !== rightCallsLeft) {
    return leftCallsRight ? -1 : 1
  }
  if (left.deps.length !== right.deps.length) {
    return right.deps.length - left.deps.length
  }
  return left.index - right.index
}

export function misplacedDecls(decls: readonly RankedDecl[]): MisplacedDecl[] {
  const depsByName = new Map(decls.map((decl) => [decl.name, decl.deps]))
  const cache = new Map<string, Set<string>>()
  const reach = (name: string) => {
    const hit = cache.get(name)
    if (hit) {
      return hit
    }
    const found = reachableNames(name, depsByName)
    cache.set(name, found)
    return found
  }
  const byRank = (left: RankedDecl, right: RankedDecl) => compareDecls(left, right, reach)

  const misplaced: MisplacedDecl[] = []
  for (let earlier = 0; earlier < decls.length; earlier += 1) {
    let after: RankedDecl | undefined
    for (let later = earlier + 1; later < decls.length; later += 1) {
      if (byRank(decls[later], decls[earlier]) >= 0) {
        continue
      }
      if (!after || byRank(decls[later], after) < 0) {
        after = decls[later]
      }
    }
    if (after) {
      misplaced.push({ name: decls[earlier].name, after: after.name })
    }
  }
  return misplaced
}
