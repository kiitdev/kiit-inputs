import type { Inputs } from "./inputs.js";
import type { Repeatable } from "./repeatable.js";

/**
 * Header-like metadata about a call (HTTP headers, CLI flags, queue attributes), rather than its
 * payload. Combines `Inputs` (one last-write-wins value per key) with `Repeatable` (every value for
 * keys that repeat).
 *
 * `kind` is what keeps `Meta` and `Args` apart. TypeScript compares shapes, and without it the two
 * would be interchangeable.
 */
export interface Meta extends Inputs, Repeatable {
  readonly kind: "meta";

  toMap(): Map<string, string>;
}
