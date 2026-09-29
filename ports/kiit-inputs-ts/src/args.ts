import type { Inputs } from "./inputs.js";
import type { Repeatable } from "./repeatable.js";

/**
 * Query/call arguments (query-string args, CLI flags used as arguments), as opposed to the
 * header-like settings in `Meta`. Same shape as `Meta`, kept as its own type so the two aren't
 * interchangeable by accident. The `kind` property is what tells them apart.
 */
export interface Args extends Inputs, Repeatable {
  readonly kind: "args";

  toMap(): Map<string, string>;
}
