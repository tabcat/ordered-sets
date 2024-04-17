import { describe, test, expect } from "vitest";
import { difference, symmetric, diff } from "../src/difference";
import { comparator, even, numbers, odd } from "./helpers/sets";
import { isGenerator } from "./helpers/isGenerator";
import { testNames } from "./helpers/test-names";

describe("difference", () => {
  test(testNames.returnsGenerator, () => { expect(isGenerator(difference([], [], comparator))).toBe(true) });

  describe("finds set difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...difference([], [], comparator)]).toEqual([])
    })

    test(testNames.firstEmpty, () => {
      expect([...difference([], numbers, comparator)]).toEqual([])
    })

    test(testNames.secondEmpty, () => {
      expect([...difference(numbers, [], comparator)]).toEqual(numbers)
    })

    test(testNames.identicalSingle, () => {
      expect([
        ...difference(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
      ]).toEqual([])
    })

    test(testNames.identical, () => {
      expect([...difference(numbers, numbers, comparator)]).toEqual([])
    })

    test(testNames.partialOverlap, () => {
      expect([...difference(numbers, even, comparator)]).toEqual(odd)
      expect([...difference(numbers, odd, comparator)]).toEqual(even)
    });

    test(testNames.noOverlap, () => {
      expect([...difference(even, odd, comparator)]).toEqual(even)
      expect([...difference(odd, even, comparator)]).toEqual(odd)
    })
  });
});

describe("symmetric", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(symmetric([], [], comparator))).toBe(true);
  });

  describe("finds set symmetric difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...symmetric([], [], comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...symmetric([], numbers, comparator)]).toEqual(numbers);
    });

    test(testNames.secondEmpty, () => {
      expect([...symmetric(numbers, [], comparator)]).toEqual(numbers);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...symmetric(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
      ]).toEqual([]);
    });

    test(testNames.identical, () => {
      expect([...symmetric(numbers, numbers, comparator)]).toEqual([]);
    });

    test(testNames.partialOverlap, () => {
      expect([...symmetric(numbers, even, comparator)]).toEqual(odd);
      expect([...symmetric(numbers, odd, comparator)]).toEqual(even);
    });

    test(testNames.noOverlap, () => {
      expect([...symmetric(even, odd, comparator)]).toEqual(numbers);
      expect([...symmetric(odd, even, comparator)]).toEqual(numbers);
    });
  });
});

describe("diff", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(diff([], [], comparator))).toBe(true);
  });

  describe("finds pairwise set symmetric difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...diff([], [], comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...diff([], numbers, comparator)]).toEqual(numbers.map(n => [null, n]));
    });

    test(testNames.secondEmpty, () => {
      expect([...diff(numbers, [], comparator)]).toEqual(numbers.map(n => [n, null]));
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...diff(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
      ]).toEqual([]);
    });

    test(testNames.identical, () => {
      expect([...diff(numbers, numbers, comparator)]).toEqual([]);
    });

    test(testNames.partialOverlap, () => {
      expect([...diff(numbers, even, comparator)]).toEqual(odd.map(n => [n, null]));
      expect([...diff(numbers, odd, comparator)]).toEqual(even.map(n => [n, null]));
    });

    test(testNames.noOverlap, () => {
      expect([...diff(even, odd, comparator)]).toEqual(numbers.map(n => [n % 2 === 0 ? n : null, n % 2 === 1 ? n : null]));
      expect([...diff(odd, even, comparator)]).toEqual(numbers.map(n => [n % 2 === 1 ? n : null, n % 2 === 0 ? n : null]));
    });
  });
});
