import { describe, test, expect } from "vitest";
import { map, slice } from "iter-tools-es";
import { numbers, even, odd, comparator, empty } from "./helpers/sets.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { testNames } from "./helpers/test-names.js";
import {
  safeArrayAccess,
  pairwiseTraversal,
  type PairwiseElement,
  readArray,
  PairwiseDone,
} from "../src/util.js";

describe("safeArrayAccess", () => {
  test("returns array[index]", () => {
    expect(safeArrayAccess([...numbers()], 0)).toBe(0);
    expect(safeArrayAccess([...numbers()], 1)).toBe(1);
    expect(safeArrayAccess([...numbers()], 2)).toBe(2);
    expect(safeArrayAccess([...numbers()], 3)).toBe(3);
    expect(safeArrayAccess([...numbers()], 4)).toBe(4);
    expect(safeArrayAccess([...numbers()], 5)).toBe(5);
    expect(safeArrayAccess([...numbers()], 6)).toBe(6);
    expect(safeArrayAccess([...numbers()], 7)).toBe(7);
  });

  test("throws if array[index] is undefined", () => {
    expect(() =>
      safeArrayAccess([...numbers()], [...numbers()].length),
    ).toThrowError();
    expect(() => safeArrayAccess([...numbers()], -1)).toThrowError();
  });
});

describe("yieldArray", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(readArray([])));
  });

  describe("iterates through indexes of an array", () => {
    describe("empty array", () => {
      test("no start, no end", () => {
        expect([...readArray([])]).toEqual([]);
      });

      test("no end", () => {
        expect([...readArray([], 0)]).toEqual([].slice(0));
        expect(() => [...readArray([], 1)]).toThrow();
      });

      test("start and end", () => {
        expect([...readArray([...numbers()], 0, 0)]).toEqual([].slice(0, 0));
        expect(() => [...readArray([], 4, 4)]).toThrow();
      });
    });

    describe("filled array", () => {
      test("no start, no end", () => {
        expect([...readArray([...numbers()])]).toEqual([...numbers()]);
      });

      test("no end", () => {
        expect([...readArray([...numbers()], 4)]).toEqual([
          ...slice(4, numbers()),
        ]);
      });

      test("start and end", () => {
        expect([...readArray([...numbers()], 1, 6)]).toEqual([
          ...slice(1, 6, numbers()),
        ]);
        expect([...readArray([...numbers()], 4, 7)]).toEqual([
          ...slice(4, 7, numbers()),
        ]);
        expect([...readArray([...numbers()], 4, 4)]).toEqual([]);
      });
    });

    describe("throws if parameter is out of bounds", () => {
      test("start is out of bounds", () => {
        expect(() => [...readArray([], 1, 1)]).toThrow();
      });

      test("end is out of bounds", () => {
        expect(() => [...readArray([], 1)]).toThrow();
      });
    });
  });
});

describe("pairwiseTraversal", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(pairwiseTraversal(empty(), empty(), comparator))).toBe(
      true,
    );
  });

  describe("finds ordered traversal of two sets", () => {
    let g: Generator<[...PairwiseElement<number>, ...PairwiseDone]>;
    let u: [...PairwiseElement<number>, ...PairwiseDone][];

    test(testNames.firstAndSecondEmpty, () => {
      g = pairwiseTraversal(empty(), empty(), comparator);
      u = [];
      for (const {} of g) {
        expect.fail();
      }
      expect(u).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      g = pairwiseTraversal(empty(), numbers(), comparator);
      u = [];
      for (const element of g) {
        expect(element[0]).toBe(null);
        expect(element[1]).toBeGreaterThanOrEqual(0);
        u.push(element);
      }
      expect(u).toEqual([...map((n) => [null, n, true, false], numbers())]);
    });

    test(testNames.secondEmpty, () => {
      g = pairwiseTraversal(numbers(), empty(), comparator);
      u = [];
      for (const element of g) {
        expect(element[1]).toBe(null);
        u.push(element);
      }
      expect(u).toEqual([...map((n) => [n, null, false, true], numbers())]);
    });

    test(testNames.identicalSingle, () => {
      g = pairwiseTraversal(
        slice(0, 1, numbers()),
        slice(0, 1, numbers()),
        comparator,
      );
      u = [];
      for (const element of g) {
        expect(element[0]).toBe(element[1]);
        u.push(element);
      }
      expect(u).toEqual([
        ...map((n) => [n, n, false, false], slice(0, 1, numbers())),
      ]);
    });

    test(testNames.identical, () => {
      g = pairwiseTraversal(numbers(), numbers(), comparator);
      u = [];
      for (const element of g) {
        expect(element[0]).toBe(element[1]);
        u.push(element);
      }
      expect(u).toEqual([...map((n) => [n, n, false, false], numbers())]);
    });

    test(testNames.partialOverlap, () => {
      g = pairwiseTraversal(numbers(), even(), comparator);
      u = [];
      for (const element of g) {
        u.push(element);
      }
      expect(u).toEqual([
        ...map(
          (n, i) => [
            n,
            n % 2 === 0 ? n : null,
            false,
            i === [...numbers()].length - 1,
          ],
          numbers(),
        ),
      ]);

      g = pairwiseTraversal(numbers(), odd(), comparator);
      u = [];
      for (const element of g) {
        u.push(element);
      }
      expect(u).toEqual([
        ...map((n) => [n, n % 2 === 1 ? n : null, false, false], numbers()),
      ]);
    });

    test(testNames.noOverlap, () => {
      g = pairwiseTraversal(even(), odd(), comparator);
      u = [];
      for (const element of g) {
        u.push(element);
      }
      expect(u).toEqual([
        ...map(
          (n, i) => [
            n % 2 === 0 ? n : null,
            n % 2 === 1 ? n : null,
            i === [...numbers()].length - 1,
            false,
          ],
          numbers(),
        ),
      ]);

      g = pairwiseTraversal(odd(), even(), comparator);
      u = [];
      for (const element of g) {
        u.push(element);
      }
      expect(u).toEqual([
        ...map(
          (n, i) => [
            n % 2 === 1 ? n : null,
            n % 2 === 0 ? n : null,
            false,
            i === [...numbers()].length - 1,
          ],
          numbers(),
        ),
      ]);
    });
  });
});
