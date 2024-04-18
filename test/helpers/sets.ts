export const numbers: number[] = new Array(8).fill(1).map((_v, i) => i);

export const even: number[] = numbers.filter((x) => x % 2 === 0);

export const odd: number[] = numbers.filter((x) => x % 2 === 1);

export const comparator = (a: number, b: number): number => a - b;
