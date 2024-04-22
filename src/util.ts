/**
 * Safely access an index of an array.
 * If the accessed index is undefined, throws an error.
 * Satisfies noUncheckedIndexedAccess of tsconfig.
 *
 * @param array - Array to access
 * @param index - Index of Array to access
 * @returns
 */
export function safeArrayAccess<T>(array: T[], index: number): T {
  const access = array[index];

  if (access == null) {
    throw new Error("failed to access index in array");
  }

  return access;
}

/**
 * Yields array indexes and element comparison from traversing two arrays in order.
 *
 * @param first - First array to traverse
 * @param second - Second array to traverse
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* dualTraversal<T>(
  first: T[],
  second: T[],
  comparator: (a: T, b: T) => number,
): Generator<[number, number, number]> {
  // can handle empty sets as parameters
  let i = -1;
  let j = -1;
  if (first.length > 0) i = 0;
  if (second.length > 0) j = 0;

  while (i >= 0 && i < first.length && j >= 0 && j < second.length) {
    const order = comparator(
      safeArrayAccess(first, i),
      safeArrayAccess(second, j),
    );

    yield [i, j, order];

    if (order < 0) {
      // first element < second element
      // increment first
      i++;

      // if i was last index, also increment j
      if (i === first.length) {
        j++;
      }
    } else if (order > 0) {
      // first element > second element
      // increment second
      j++;

      // if j was last index, also increment i
      if (j === second.length) {
        i++;
      }
    } else {
      // first element = second element
      // increment both
      i++;
      j++;
    }
  }

  while (i >= 0 && i < first.length) {
    // only second set is empty
    if (j === -1) {
      yield [i, j, -1]; // -1 because first[i] (comparator a param) is < undefined
    } else {
      yield [
        i,
        j - 1,
        comparator(safeArrayAccess(first, i), safeArrayAccess(second, j - 1)),
      ];
    }

    i++;
  }

  while (j >= 0 && j < second.length) {
    // only first set is empty
    if (i === -1) {
      yield [i, j, 1]; // 1 because second[j] (comparator b param) is < undefined
    } else {
      yield [
        i - 1,
        j,
        comparator(safeArrayAccess(first, i - 1), safeArrayAccess(second, j)),
      ];
    }

    j++;
  }
}

/**
 * Yields elements of an array from start index to end index.
 * Similar to array.slice, however negative numbers as parameters are not supported yet.
 *
 * @param array - Array to read from
 * @param start - Index to start at (inclusive)
 * @param end - Index to end at (exclusive)
 */
export function* readArray<T>(
  array: T[],
  start: number = 0,
  end: number = array.length,
): Generator<T> {
  if (start < 0) {
    throw new Error("start cannot be negative");
  }

  if (start > Math.max(0, array.length - 1)) {
    throw new Error("start cannot be greater than the indexes in the array");
  }

  if (end > array.length) {
    throw new Error("end cannot be greater than length of the array");
  }

  if (end < start) {
    throw new Error("end cannot be less than start");
  }

  while (start < end) {
    yield safeArrayAccess(array, start);
    start++;
  }
}

export type PairwiseElement<T> = [T, null] | [null, T] | [T, T];

export function* pairwiseTraversal<T>(
  source: T[],
  target: T[],
  comparator: (a: T, b: T) => number,
): Generator<PairwiseElement<T>> {
  for (const [i, j, order] of dualTraversal(source, target, comparator)) {
    switch (true) {
      case order < 0:
        yield [safeArrayAccess(source, i), null];
        break;
      case order > 0:
        yield [null, safeArrayAccess(target, j)];
        break;
      default: // order === 0
        yield [safeArrayAccess(source, i), safeArrayAccess(target, j)];
    }

    // if source is exausted
    if (order <= 0 && i === source.length - 1) {
      if (j >= 0) {
        // j could be -1
        if (order < 0) {
          // if order is not equal then also yield target[j]
          yield [null, safeArrayAccess(target, j)];
        }

        if (j < target.length - 1) {
          // yield the rest of target
          for (const element of readArray(target, j + 1)) {
            yield [null, element];
          }
          break;
        }
      }
    }

    // if target is exausted
    if (order >= 0 && j === target.length - 1) {
      if (i >= 0) {
        // i could be -1
        if (order > 0) {
          // if order is not equal then also yield source[i]
          yield [safeArrayAccess(source, i), null];
        }

        if (i < source.length - 1) {
          // yield the rest of source
          for (const element of readArray(source, i + 1)) {
            yield [element, null];
          }
          break;
        }
      }
    }
  }
}
