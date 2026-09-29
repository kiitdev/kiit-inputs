import type { Args } from "./args.js";
import { ListMapReads } from "./list-map-reads.js";

/** An `Args` backed by `ListMapReads`. See there for the actual read behavior. */
export class ArgsMap extends ListMapReads implements Args {
  readonly kind = "args" as const;
}
