import { describe, expect, test } from 'bun:test'
import { compareDecls, misplacedDecls, reachableNames, type RankedDecl } from './topo-order.ts'

function decl(
  name: string,
  index: number,
  exported: boolean,
  deps: readonly string[],
): RankedDecl {
  return { name, exported, deps, index }
}

describe('reachableNames', () => {
  test('follows local callees', () => {
    const deps = new Map<string, readonly string[]>([
      ['a', ['b']],
      ['b', ['c']],
      ['c', []],
    ])
    expect([...reachableNames('a', deps)].sort()).toEqual(['b', 'c'])
    expect([...reachableNames('c', deps)]).toEqual([])
  })
})

describe('compareDecls', () => {
  const reach = (name: string) => {
    if (name === 'parent') {
      return new Set(['leaf'])
    }
    return new Set<string>()
  }

  test('exported declarations come first', () => {
    const exported = decl('api', 1, true, [])
    const local = decl('helper', 0, false, ['other'])
    expect(compareDecls(exported, local, reach)).toBeLessThan(0)
    expect(compareDecls(local, exported, reach)).toBeGreaterThan(0)
  })

  test('callers come before their local callees', () => {
    const parent = decl('parent', 1, false, ['leaf'])
    const leaf = decl('leaf', 0, false, [])
    expect(compareDecls(parent, leaf, reach)).toBeLessThan(0)
  })

  test('higher local fan-out ranks earlier when unrelated', () => {
    const heavy = decl('heavy', 1, false, ['a', 'b'])
    const light = decl('light', 0, false, ['a'])
    expect(compareDecls(heavy, light, () => new Set())).toBeLessThan(0)
  })
})

describe('misplacedDecls', () => {
  test('keeps a file that already follows the rank', () => {
    const decls = [
      decl('api', 0, true, ['helper']),
      decl('helper', 1, false, ['leaf']),
      decl('leaf', 2, false, []),
    ]
    expect(misplacedDecls(decls)).toEqual([])
  })

  test('flags a leaf sitting above an export', () => {
    const decls = [
      decl('leaf', 0, false, []),
      decl('api', 1, true, ['leaf']),
    ]
    expect(misplacedDecls(decls)).toEqual([{ name: 'leaf', after: 'api' }])
  })
})
