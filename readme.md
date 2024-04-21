# ordered-sets

Utilities for working with ordered sets.

- Zero Dependencies
- Uses Javascript Arrays
- Efficient Diffs

Core of library is the `dualTraversal` generator in [src/util.ts](https://github.com/tabcat/ordered-sets/blob/master/src/util.ts).

## API Docs

https://tabcat.github.io/ordered-sets/

## Install

Available from NPM at name: `@tabcat/ordered-sets`

## Build

In this package we use [PNPM](https://pnpm.io/)

```
pnpm install
pnpm build
```

## Performance

This library provides efficient operations for ordered sets.

May be useful in the following cases:

- Set elements must remain in order.
- Set elements are expensive to store as primitives.
- Set sizes are large (>500,000 elements)

If none of these apply, it's probably better to implement the needed operations using Javascript's Set class.

### Benchmarks

There's a very simple benchmark comparing the set operations difference, symmetric difference, union and intersection implemented in this library versus an implementation using Set.

```
pnpm install
pnpm benchmark
```

Output should look something like this:

```
difference      impl: Set               size: 1000 x 39,330 ops/sec ±0.95% (94 runs sampled)
difference      impl: ordered-sets      size: 1000 x 34,476 ops/sec ±0.27% (98 runs sampled)
symmetric       impl: Set               size: 1000 x 80,485 ops/sec ±1.22% (93 runs sampled)
symmetric       impl: ordered-sets      size: 1000 x 25,945 ops/sec ±0.28% (101 runs sampled)
union           impl: Set               size: 1000 x 45,971 ops/sec ±1.13% (91 runs sampled)
union           impl: ordered-sets      size: 1000 x 25,897 ops/sec ±0.31% (98 runs sampled)
intersection    impl: Set               size: 1000 x 44,982 ops/sec ±0.62% (95 runs sampled)
intersection    impl: ordered-sets      size: 1000 x 36,325 ops/sec ±0.43% (99 runs sampled)
```

## Extension

If you have a usecase for a missing feature be sure to make an issue.
Have been thinking about building a merge function.
