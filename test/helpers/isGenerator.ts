export const isGenerator = (g: Generator<unknown>): boolean =>
  g[Symbol.iterator] != null && typeof g.next === "function";
