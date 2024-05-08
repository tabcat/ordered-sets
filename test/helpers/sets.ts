import { filter } from "iter-tools-es";

export const createNumbers = function* (n: number): Generator<number> {
  let i = 0;
  while (i < n) {
    yield i;
    i++;
  }
};

export const numbers: () => Iterable<number> = () => createNumbers(8);

export const even: () => Iterable<number> = () =>
  filter((x: number) => x % 2 === 0, numbers());

export const odd: () => Iterable<number> = () =>
  filter((x: number) => x % 2 === 1, numbers());

export const empty: () => Iterable<number> = () => createNumbers(0);

export const comparator = (a: number, b: number): number => a - b;
