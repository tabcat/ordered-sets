import { describe, test, expect } from "vitest";
import { numbers, even, odd, comparator } from "./helpers/sets";
import { isGenerator } from "./helpers/isGenerator";
import { testNames } from "./helpers/test-names";
import { safeArrayAccess, dualTraversal, readArray } from "../src/util";

describe("safeArrayAccess", () => {
  test("returns array[index]", () => {
    expect(safeArrayAccess(numbers, 0)).toBe(0);
    expect(safeArrayAccess(numbers, 1)).toBe(1);
    expect(safeArrayAccess(numbers, 2)).toBe(2);
    expect(safeArrayAccess(numbers, 3)).toBe(3);
    expect(safeArrayAccess(numbers, 4)).toBe(4);
    expect(safeArrayAccess(numbers, 5)).toBe(5);
    expect(safeArrayAccess(numbers, 6)).toBe(6);
    expect(safeArrayAccess(numbers, 7)).toBe(7);
  });

  test("throws if array[index] is undefined", () => {
    expect(() => safeArrayAccess(numbers, 8)).toThrowError();
  });
});

describe("dualTraversal", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(dualTraversal([], [], comparator))).toBe(true);
  });

  describe("finds ordered traversal of two sets", () => {
    let g: Generator<[number, number, number]>;
    let u: number[];

    test(testNames.firstAndSecondEmpty, () => {
      g = dualTraversal([], [], comparator);
      u = [];
      for (const {} of g) {
        expect.fail();
      }
      expect(u).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      g = dualTraversal([], numbers, comparator);
      u = [];
      for (const [i, j, order] of g) {
        expect(i).toBe(-1);
        expect(j).toBeGreaterThanOrEqual(0);
        expect(order).toBe(1);
        u.push(safeArrayAccess(numbers, j));
      }
      expect(u).toEqual(numbers);
    });

    test(testNames.secondEmpty, () => {
      g = dualTraversal(numbers, [], comparator);
      u = [];
      for (const [i, j, order] of g) {
        expect(i).toBeGreaterThanOrEqual(0);
        expect(j).toBe(-1);
        expect(order).toBe(-1);
        u.push(safeArrayAccess(numbers, i));
      }
      expect(u).toEqual(numbers);
    });

    test(testNames.identicalSingle, () => {
      g = dualTraversal(numbers.slice(0, 1), numbers.slice(0, 1), comparator);
      u = [];
      for (const [i, j, order] of g) {
        expect(i).toEqual(j);
        expect(order).toEqual(0);
        u.push(safeArrayAccess(numbers.slice(0, 1), i));
      }
      expect(u).toEqual(numbers.slice(0, 1));
    });

    test(testNames.identical, () => {
      g = dualTraversal(numbers, numbers, comparator);
      u = [];
      for (const [i, j, order] of g) {
        expect(i).toEqual(j);
        expect(order).toEqual(0);
        u.push(safeArrayAccess(numbers, i));
      }
      expect(u).toEqual(numbers);
    });

    test(testNames.partialOverlap, () => {
      g = dualTraversal(numbers, even, comparator);
      u = [];
      for (const [i, j, order] of g) {
        if (i !== 7) {
          expect(order).toBeLessThanOrEqual(0);
        } else {
          expect(order).toBe(1);
        }
        expect(i).toBeGreaterThanOrEqual(j);
        u.push(safeArrayAccess(numbers, i));
      }
      expect(u).toEqual(numbers);

      g = dualTraversal(numbers, odd, comparator);
      u = [];
      for (const [i, j, order] of g) {
        expect(order).toBeLessThanOrEqual(0);
        expect(i).toBeGreaterThanOrEqual(j);
        u.push(safeArrayAccess(numbers, i));
      }
      expect(u).toEqual(numbers);
    });

    test(testNames.noOverlap, () => {
      g = dualTraversal(even, odd, comparator);
      u = [];
      for (const [i, j, order] of g) {
        if (i === j) {
          expect(order).toEqual(-1);
          u.push(safeArrayAccess(even, i));
          u.push(safeArrayAccess(odd, j));
        } else {
          expect(order).toEqual(1);
        }
      }
      expect(u).toEqual(numbers);

      g = dualTraversal(odd, even, comparator);
      u = [];
      for (const [i, j, order] of g) {
        if (i === j) {
          expect(order).toEqual(1);
          u.push(safeArrayAccess(even, j));
          u.push(safeArrayAccess(odd, i));
        } else {
          expect(order).toEqual(-1);
        }
      }
      expect(u).toEqual(numbers);
    });
  });
});

describe("readArray", () => {
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
        expect([...readArray(numbers, 0, 0)]).toEqual([].slice(0, 0));
        expect(() => [...readArray([], 4, 4)]).toThrow();
      });
    });

    describe("filled array", () => {
      test("no start, no end", () => {
        expect([...readArray(numbers)]).toEqual(numbers);
      });

      test("no end", () => {
        expect([...readArray(numbers, 4)]).toEqual(numbers.slice(4));
      });

      test("start and end", () => {
        expect([...readArray(numbers, 1, 6)]).toEqual(numbers.slice(1, 6));
        expect([...readArray(numbers, 4, 7)]).toEqual(numbers.slice(4, 7));
        expect([...readArray(numbers, 4, 4)]).toEqual([]);
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
