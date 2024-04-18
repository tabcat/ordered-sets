import { safeArrayAccess, dualTraversal, readArray } from "./util.js";

/**
 * Yields the union of two ordered sets.
 *
 * @param source - Set of elements to add to union
 * @param target - Set of elements to also add to union
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* union<T>(
  source: T[],
  target: T[],
  comparator: (a: T, b: T) => number,
): Generator<T> {
  let pastSource: boolean = false;
  let pastTarget: boolean = false;

  // logic is similar to diff, might be able to generalize this
  for (const [i, j, order] of dualTraversal(source, target, comparator)) {
    if (pastSource) {
      yield* readArray(target, j);
      break;
    }

    if (pastTarget) {
      yield* readArray(source, i);
      break;
    }

    if (order < 0) {
      yield safeArrayAccess(source, i);
    }

    if (order > 0) {
      yield safeArrayAccess(target, j);
    }

    if (order === 0) {
      yield safeArrayAccess(source, i);
    }

    // see if source is exausted
    if (order <= 0 && i === source.length - 1) {
      pastSource = true;
      // if order is not equal then also yield minuend[i]
      if (order < 0 && j >= 0) {
        // j could be -1
        yield safeArrayAccess(target, j);
      }
    }

    // see if target is exausted
    if (order >= 0 && j === target.length - 1) {
      pastTarget = true;
      // if order is not equal then also yield minuend[i]
      if (order > 0 && i >= 0) {
        // i could be -1
        yield safeArrayAccess(source, i);
      }
    }
  }
}
