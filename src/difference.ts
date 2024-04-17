import { safeArrayAccess, dualTraversal, readArray } from "./util";

/**
 * Set difference of two ordered sets in a new array.
 *
 * @param minuend - Set from which to remove elements
 * @param subtrahend - Set of elements to be removed
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* difference<T>(
  minuend: T[],
  subtrahend: T[],
  comparator: (a: T, b: T) => number
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
 * Set symmetric difference of two ordered sets in a new array.
 *
 * @param minuend - Source ordered set
 * @param subtrahend - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* symmetric<T>(
  minuend: T[],
  subtrahend: T[],
  comparator: (a: T, b: T) => number
): Generator<T> {
  for (const [s, t] of diff(minuend, subtrahend, comparator)) {
    yield (s ?? t)!;
  }
}

type Diff<T> = [T, null] | [null, T];

/**
 * Diff of two ordered sets.
 *
 * @param source - Source ordered set
 * @param target - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* diff<T>(
  source: T[],
  target: T[],
  comparator: (a: T, b: T) => number
): Generator<Diff<T>> {
  let pastSource = false;
  let pastTarget = false;

  for (const [i, j, order] of dualTraversal(source, target, comparator)) {
    if (pastSource) {
      for (const element of readArray(target, j)) {
        yield [null, element];
      }
      break;
    }

    if (pastTarget) {
      for (const element of readArray(source, i)) {
        yield [element, null];
      }
      break;
    }

    if (order < 0) {
      yield [safeArrayAccess(source, i), null];
    }

    if (order > 0) {
      yield [null, safeArrayAccess(target, j)];
    }

    // see if source is exausted
    if (order <= 0 && i === source.length - 1) {
      pastSource = true;
      // if order is not equal then also yield minuend[i]
      if (order < 0 && j > 0) {
        // j could be -1
        yield [null, safeArrayAccess(target, j)];
      }
    }

    // see if target is exausted
    if (order >= 0 && j === target.length - 1) {
      pastTarget = true;
      // if order is not equal then also yield minuend[i]
      if (order > 0 && i > 0) {
        // i could be -1
        yield [safeArrayAccess(source, i), null];
      }
    }
  }
}
