import { describe, test, expect } from "vitest";
import { split } from "../src/split.js";
import { comparator, even, numbers, odd } from "./helpers/sets.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { testNames } from "./helpers/test-names.js";
import { safeArrayAccess } from "../src/util.js";

describe("split", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(split([], [], comparator))).toBe(true);
  });

  describe("finds split of two ordered sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...split([], [], comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...split([], numbers, comparator)]).toEqual(numbers.map(_ => []));
    });

    test(testNames.secondEmpty, () => {
      expect([...split(numbers, [], comparator)]).toEqual([numbers]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...split(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
      ]).toEqual([numbers.slice(0, 1)]);
    });

    test(testNames.identical, () => {
      expect([...split(numbers, numbers, comparator)]).toEqual(
        numbers.map((n) => [n])
      );
    });

    test(testNames.partialOverlap, () => {
      expect([...split(numbers, even, comparator)]).toEqual([
        ...even.map((n, i) =>
          odd[i - 1] == null ? [n] : [safeArrayAccess(odd, i - 1), n]
        ),
        [odd[odd.length - 1]],
      ]);
      expect([...split(numbers, odd, comparator)]).toEqual(
        odd.map((n, i) => [safeArrayAccess(even, i), n])
      );
    });

    test(testNames.noOverlap, () => {
      expect([...split(even, odd, comparator)]).toEqual(even.map((n) => [n]));
      expect([...split(odd, even, comparator)]).toEqual([[], ...odd.map((n) => [n])]);
    });
  });
});
