package kiit.inputs

/** An [Args] backed by [ListMapReads]. See there for the actual read behavior. */
class ArgsMap(rs: ListMap<String, String>) : ListMapReads(rs), Args
