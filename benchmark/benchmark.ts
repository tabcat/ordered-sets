import Benchmark from "benchmark"
import { comparator, createNumbers } from "../test/helpers/sets.js"
import { safeArrayAccess } from "../src/util.js"
import { difference, symmetric } from "../src/difference.js"
import { union } from '../src/union.js'
import { intersection } from "../src/intersection.js"

const setSizes = [1000]
const lotsOfArrays = setSizes.map(createNumbers)
const lotsOfSets = lotsOfArrays.map(x => new Set(x))

// Set class implementation of a set operation
interface SetImpl {
  (s: Set<number>, t: Set<number>): Set<number>
}

// ordered-set implementation of a set operation
interface OrderedImpl {
  (s: number[], t: number[], comparator: (a: number, b: number) => number): number[]
}

const versusSet = (setImpl: SetImpl, orderedImpl: OrderedImpl, name: string, index: number): void => {
  const sample = safeArrayAccess(lotsOfArrays, index).filter(() => Math.random() > 0.5)
  const sampleSet = new Set(sample)

  new Benchmark.Suite()
  .add(`${name}\timpl: Set\t\tsize: ${safeArrayAccess(setSizes, index)}`, (): void => {
    setImpl(safeArrayAccess(lotsOfSets, index), sampleSet)
  })
  .add(`${name}\timpl: ordered-sets\tsize: ${safeArrayAccess(setSizes, index)}`, (): void => {
    for (const _ of orderedImpl(safeArrayAccess(lotsOfArrays, index), sample, comparator)) {}
  })
  .on('cycle', (event: any) => {
    console.log(String(event.target))
  })
  .run()
}

export const versusSets = (setImpl: SetImpl, orderedImpl: OrderedImpl, name: string): void => {
  setSizes.map((_, index) => versusSet(setImpl, orderedImpl, name, index))
}

/**
 * Returns the difference of two sets using the Set class.
 * 
 * @param minuend 
 * @param subtrahend 
 */
const _difference = <T>(minuend: Set<T>, subtrahend: Set<T>): Set<T> => {
  const r: Set<T> = new Set(minuend)

  for (const element of subtrahend) {
    if (r.has(element)) r.delete(element)
  }

  return r
}

/**
 * Returns the difference of two sets using the Set class.
 * 
 * @param source 
 * @param target
 */
const _symmetric = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set()

  for (const element of source) {
    if (!target.has(element)) r.add(element)
  }

  for (const element of target) {
    if (!source.has(element)) r.add(element)
  }

  return r
}

/**
 * Returns the union of two sets using the Set class.
 * 
 * @param source
 * @param target
 */
const _union = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set(source)

  for (const element of target) {
    r.add(element)
  }

  return r
}

/**
 * Returns the intersection of two sets using the Set class.
 * 
 * @param source
 * @param target
 */
const _intersection = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set(source)

  for (const element of target) {
    r.add(element)
  }

  return r
}

// @ts-expect-error
versusSets(_difference, difference, 'difference')
// @ts-expect-error
versusSets(_symmetric, symmetric, 'symmetric')
// @ts-expect-error
versusSets(_union, union, 'union\t')
// @ts-expect-error
versusSets(_intersection, intersection, 'intersection')