import { safeArrayAccess, dualTraversal } from "./util";

/**
 * Set intersection of two ordered sets in a new array.
 * 
 * @param source - Set from which to remove elements
 * @param target - Set of elements to be removed
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function * intersection <T>(source: T[], target: T[], comparator: (a: T, b: T) => number): Generator<T> {
  for (const [, j, order] of dualTraversal(source, target, comparator)) {
    if (order === 0) {
      yield safeArrayAccess(target, j)
    }
  }
}
