import { pairwiseTraversal } from "./util.js";

/**
 * Yields the difference of two ordered sets.
 *
 * @param minuend - Set from which to remove elements
 * @param subtrahend - Set of elements to be removed
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* difference<T>(
  minuend: Iterable<T>,
  subtrahend: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<T> {
  for (const [m, s] of pairwiseTraversal(minuend, subtrahend, comparator)) {
    if (s === null) {
      yield m!;
    }
  }
}

/**
 * Yields the symmetric difference of two ordered sets.
 *
 * @param minuend - Source ordered set
 * @param subtrahend - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* symmetric<T>(
  minuend: Iterable<T>,
  subtrahend: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<T> {
  for (const [s, t] of pairwiseTraversal(minuend, subtrahend, comparator)) {
    if (s === null) {
      yield t!
    }

    if (t === null) {
      yield s!
    }
  }
}

export type Diff<T> = [T, null] | [null, T];

/**
 * Yields the pairwise symmetric difference of two ordered sets.
 *
 * @param source - Source ordered set
 * @param target - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* diff<T>(
  source: Iterable<T>,
  target: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<Diff<T>> {
  for (const [s, t] of pairwiseTraversal(source, target, comparator)) {
    if (s === null || t === null) {
      yield [s, t] as Diff<T>;
    }
  }
}
