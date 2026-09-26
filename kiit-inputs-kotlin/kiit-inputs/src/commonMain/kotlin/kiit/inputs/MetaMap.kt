package kiit.inputs

/** A [Meta] backed by [ListMapReads]. See there for the actual read behavior. */
class MetaMap(rs: ListMap<String, String>) : ListMapReads(rs), Meta
