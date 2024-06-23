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

export type Range = [
  // inclusive start of range
  start: number,
  // exclusive end of range
  end: number,
];

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

export type PairwiseElement<A, B> = [A, null] | [null, B] | [A, B];

export type PairwiseDone = [source: boolean, target: boolean];

/**
 * Only returns true if IteratorResult.value is undefined and IteratorResult.done is true
 *
 * @param result - Iterator Result
 * @returns
 */
export const iteratorIsDone = (result: IteratorResult<unknown>): boolean =>
  result.value === undefined && result.done === true;

/**
 * Yields pairwise traversal of two ordered sets.
 *
 * @param source - Source ordered set
 * @param target - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* pairwiseTraversal<A, B>(
  source: Iterable<A>,
  target: Iterable<B>,
  comparator: (a: A, b: B) => number,
): Generator<[...PairwiseElement<A, B>, ...PairwiseDone]> {
  const iteratorS = source[Symbol.iterator]();
  const iteratorT = target[Symbol.iterator]();

  // initialize s and t
  let s = iteratorS.next();
  let t = iteratorT.next();

  let sourceDone = iteratorIsDone(s);
  let targetDone = iteratorIsDone(t);

  while (!sourceDone && !targetDone) {
    const order = comparator(s.value, t.value);

    const result = [null, null, sourceDone, targetDone] as [
      ...PairwiseElement<A, B>,
      ...PairwiseDone,
    ];

    if (order <= 0) {
      result[0] = s.value;
      s = iteratorS.next();
    }

    if (order >= 0) {
      result[1] = t.value;
      t = iteratorT.next();
    }

    yield result;

    if (s.done === true) {
      sourceDone = iteratorIsDone(s);
    }
    if (t.done === true) {
      targetDone = iteratorIsDone(t);
    }
  }

  while (!sourceDone) {
    yield [s.value, null, sourceDone, targetDone];
    s = iteratorS.next();
    if (s.done === true) {
      sourceDone = iteratorIsDone(s);
    }
  }

  while (!targetDone) {
    yield [null, t.value, sourceDone, targetDone];
    t = iteratorT.next();
    if (t.done === true) {
      targetDone = iteratorIsDone(t);
    }
  }
}
