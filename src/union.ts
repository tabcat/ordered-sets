import { pairwiseTraversal } from "./util.js";

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
  for (const [s, t] of pairwiseTraversal(source, target, comparator)) {
    yield (s ?? t)!
   }
}
