/**
 * Deep-partial dictionary merging.
 *
 * Every locale is a draft translation. Missing keys fall back to English so a
 * half-translated section can never render an empty heading. Arrays are treated
 * as whole values (a translated list replaces the English list entirely).
 */

export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? U[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export function merge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (patch === undefined) return base;
  if (Array.isArray(patch)) return patch as unknown as T;

  if (
    patch &&
    typeof patch === 'object' &&
    base &&
    typeof base === 'object' &&
    !Array.isArray(base)
  ) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
      out[key] = merge((base as Record<string, unknown>)[key], value as DeepPartial<unknown>);
    }
    return out as T;
  }

  return patch as T;
}
