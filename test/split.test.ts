import { describe, test, expect } from "vitest";
import { map, slice } from "iter-tools-es";
import { split } from "../src/split.js";
import { comparator, empty, even, numbers, odd } from "./helpers/sets.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { testNames } from "./helpers/test-names.js";
import { safeArrayAccess } from "../src/util.js";

describe("split", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(split(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds split of two ordered sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...split(empty(), empty(), comparator)]).toEqual([[]]);
    });

    test(testNames.firstEmpty, () => {
      expect([...split(empty(), numbers(), comparator)]).toEqual([
        ...map((_) => [], numbers()),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...split(numbers(), empty(), comparator)]).toEqual([
        [...numbers()],
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...split(slice(0, 1, numbers()), slice(0, 1, numbers()), comparator),
      ]).toEqual([[...slice(0, 1, numbers())]]);
    });

    test(testNames.identical, () => {
      expect([...split(numbers(), numbers(), comparator)]).toEqual([
        ...map((n) => [n], numbers()),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...split(numbers(), even(), comparator)]).toEqual([
        ...map(
          (n, i) =>
            [...odd()][i - 1] == null
              ? [n]
              : [safeArrayAccess([...odd()], i - 1), n],
          even(),
        ),
        [[...odd()][[...odd()].length - 1]],
      ]);
      expect([...split(numbers(), odd(), comparator)]).toEqual([
        ...map((n, i) => [safeArrayAccess([...even()], i), n], odd()),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...split(even(), odd(), comparator)]).toEqual([
        ...map((n) => [n], even()),
      ]);
      expect([...split(odd(), even(), comparator)]).toEqual([
        [],
        ...map((n) => [n], odd()),
      ]);
    });
  });
});
