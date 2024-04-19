# ordered-sets

Utilities for working with ordered sets.

- Zero Dependencies
- Uses Javascript Arrays
- Efficient Diffs

Core of library is the `dualTraversal` generator in [src/util.ts](https://github.com/tabcat/ordered-sets/blob/master/src/util.ts).

## Install

Available from NPM at name: `@tabcat/ordered-sets`

## API Docs

https://tabcat.github.io/ordered-sets/

## Performance

This library provides efficient operations for ordered sets.

May be useful in the following cases:

- Set elements must remain in order.
- Set elements are expensive to store as primitives.
- Set sizes are large (>500,000 elements)

If none of these apply, it's probably better to implement the needed operations using Javascript's Set class.

## Extension

If you have a usecase for a missing feature be sure to make an issue.
Have been thinking about building a merge function.
