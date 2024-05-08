import { pairwiseTraversal } from "./util";

/**
 * Splits a set into multiple sets at sector points.
 *
 * @param source - Set to split at each sector point (inclusive)
 * @param sectors - Set of sector points
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* split<T>(
  source: Iterable<T>,
  sectors: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<T[]> {
  let section: T[] = [];

  for (const [a, b] of pairwiseTraversal(source, sectors, comparator)) {
    if (a != null) {
      section.push(a);
    }

    if (b != null) {
      yield section;
      section = [];
    }
  }

  if (section.length > 0) yield section;
}
