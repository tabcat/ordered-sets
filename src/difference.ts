import {
  safeArrayAccess,
  dualTraversal,
  readArray,
  pairwiseTraversal,
} from "./util.js";

/**
 * Yields the difference of two ordered sets.
 *
 * @param minuend - Set from which to remove elements
 * @param subtrahend - Set of elements to be removed
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* difference<T>(
  minuend: T[],
  subtrahend: T[],
  comparator: (a: T, b: T) => number,
): Generator<T> {
  let pastSubtrahend: boolean = false;

  for (const [i, j, order] of dualTraversal(minuend, subtrahend, comparator)) {
    // yield the rest of the minuend if subtrahend is exhausted
    if (pastSubtrahend) {
      yield* readArray(minuend, i);
      break;
    }

    // yield if order < 0 because i has been compared
    if (order < 0) {
      yield safeArrayAccess(minuend, i);
    }

    // see if subtrahend is exhausted
    if (order >= 0 && j === subtrahend.length - 1) {
      pastSubtrahend = true;
      // if order is not equal then also yield minuend[i]
      if (order > 0 && i > 0) {
        // i could be -1
        yield safeArrayAccess(minuend, i);
      }
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
  minuend: T[],
  subtrahend: T[],
  comparator: (a: T, b: T) => number,
): Generator<T> {
  for (const [s, t] of diff(minuend, subtrahend, comparator)) {
    yield (s ?? t)!;
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
  source: T[],
  target: T[],
  comparator: (a: T, b: T) => number,
): Generator<Diff<T>> {
  for (const [s, t] of pairwiseTraversal(source, target, comparator)) {
    if (s === null || t === null) {
      yield [s, t] as Diff<T>;
    }
  }
}
