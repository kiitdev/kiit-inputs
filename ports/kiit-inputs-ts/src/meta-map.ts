import { ListMapReads } from "./list-map-reads.js";
import type { Meta } from "./meta.js";

/** A `Meta` backed by `ListMapReads`. See there for the actual read behavior. */
export class MetaMap extends ListMapReads implements Meta {
  readonly kind = "meta" as const;
}
