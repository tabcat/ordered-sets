import { describe, test, expect } from "vitest";
import { intersection } from "../src/intersection";
import { comparator, even, numbers, odd } from "./helpers/sets";
import { isGenerator } from "./helpers/isGenerator";

describe("intersection", () => {
  test("finds intersection of two ordered sets", () => {
    expect(isGenerator(intersection([], [], comparator))).toBe(true);

    // identitical sets
    expect([...intersection(numbers, numbers, comparator)]).toEqual(numbers);

    // identitical sets (single-element)
    expect([
      ...intersection(numbers.slice(0, 1), numbers.slice(0, 1), comparator),
    ]).toEqual([0]);

    // empty A
    expect([...intersection([], numbers, comparator)]).toEqual([]);

    // empty B
    expect([...intersection(numbers, [], comparator)]).toEqual([]);

    // empty A and B
    expect([...intersection([], [], comparator)]).toEqual([]);

    // partial overlap
    expect([...intersection(numbers, even, comparator)]).toEqual(even);

    // no overlap
    expect([...intersection(even, odd, comparator)]).toEqual([]);
  });
});
