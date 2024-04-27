import { pairwiseTraversal } from "./util";

/**
 * Splits a set into multiple sets at sector points
 * 
 * @param source - Set to split at each sector point (inclusive)
 * @param sectors - Set of sector points
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* split <T>(source: T[], sectors: T[], comparator: (a: T, b: T) => number): Generator<T[]> {
  let section: T[] = []
  for (const [a, b] of pairwiseTraversal(source, sectors, comparator)) {
    // keeping all the elements from source, just splitting them up
    if (a !== null) {
      section.push(a)
    }

    // only split if b is not null and section has elements OR source is exausted
    if ((b !== null && section.length > 0) || a === source[source.length - 1]) {
      yield section
      section = []

      // no more elements to be split
      if (a === source[source.length - 1]) {
        break
      }
    }
  }
}