export const numbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7]

export const even: number[] = numbers.filter(x => x % 2 === 0)

export const odd: number[] = numbers.filter(x => x % 2 === 1)

export const comparator = (a :number, b: number): number => a - b
