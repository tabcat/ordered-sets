import { describe, test, expect } from "vitest";
import { union } from "../src/union";
import { comparator, even, numbers, odd } from "./helpers/sets";
import { isGenerator } from "./helpers/isGenerator";
import { testNames } from "./helpers/test-names";

describe("union", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(union([], [], comparator))).toBe(true);
  });

  describe("finds union of two ordered sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...union([], [], comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...union([], numbers, comparator)]).toEqual(numbers);
    });

    test(testNames.secondEmpty, () => {
      expect([...union(numbers, [], comparator)]).toEqual(numbers);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...union(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
      ]).toEqual(numbers.slice(0, 1));
    });

    test(testNames.identical, () => {
      expect([...union(numbers, numbers, comparator)]).toEqual(numbers);
    });

    test(testNames.partialOverlap, () => {
      expect([...union(numbers, even, comparator)]).toEqual(numbers);
      expect([...union(numbers, odd, comparator)]).toEqual(numbers);
    });

    test(testNames.noOverlap, () => {
      expect([...union(even, odd, comparator)]).toEqual(numbers);
      expect([...union(odd, even, comparator)]).toEqual(numbers);
    });
  });
});
