# ordered-sets

Utilities for working with ordered sets.

- Zero Dependencies
- Uses ES6 Iterables

Core of library is the `pairwiseTraversal` generator in [src/util.ts](https://github.com/tabcat/ordered-sets/blob/master/src/util.ts).

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

If none of these apply, it's probably better to implement the needed operations using Javascript's Set class.

### Benchmarks

There's a very simple benchmark comparing the set operations difference, symmetric difference, union and intersection implemented in this library versus an implementation using Set.

```
pnpm install
pnpm benchmark
```

Output should look something like this:

```
difference      impl: Set               size: 1000 x 39,688 ops/sec ±0.22% (99 runs sampled)
difference      impl: ordered-sets      size: 1000 x 23,496 ops/sec ±0.12% (98 runs sampled)
symmetric       impl: Set               size: 1000 x 64,616 ops/sec ±0.16% (101 runs sampled)
symmetric       impl: ordered-sets      size: 1000 x 16,703 ops/sec ±0.21% (100 runs sampled)
union           impl: Set               size: 1000 x 50,969 ops/sec ±0.53% (99 runs sampled)
union           impl: ordered-sets      size: 1000 x 23,659 ops/sec ±0.13% (101 runs sampled)
intersection    impl: Set               size: 1000 x 46,803 ops/sec ±1.71% (92 runs sampled)
intersection    impl: ordered-sets      size: 1000 x 35,847 ops/sec ±0.17% (101 runs sampled)
```

## Extension

If you have a usecase for a missing feature be sure to make an issue.
Have been thinking about building a merge function.
