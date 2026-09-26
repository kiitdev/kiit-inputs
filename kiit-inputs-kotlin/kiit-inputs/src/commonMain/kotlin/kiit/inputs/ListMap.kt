package kiit.inputs

/**
 * An ordered, immutable collection giving O(1) lookup both by key and by position. This is
 * the combination `Record`/`RecordMap` need, since a DB row is addressable by column name or
 * index, and neither a plain `List<Pair<A,B>>` (no fast key lookup) nor a `LinkedHashMap`
 * (no positional index, no duplicate-key tolerance) provides it alone.
 */
open class ListMap<A, B>(protected val list: List<Pair<A, B>> = listOf()) {
    // Index of each key's last position in `list`. Duplicate keys are tolerated in `list`
    // itself, but key-based lookup resolves to the last occurrence, same as a Map would.
    protected val map = convert(list)

    val size: Int = list.size

    fun contains(key: A): Boolean = map.contains(key)

    /**
     * The value associated with `key`, if present.
     */
    operator fun get(key: A): B? {
        if (!map.containsKey(key)) return null
        val ndx = map[key]
        return if (ndx == null) null else list[ndx].second
    }

    /**
     * The value at the given position.
     */
    fun getAt(pos: Int): B? = list[pos].second

    /**
     * Every value stored under `key`, in insertion order. Unlike [get] (last-write-wins),
     * this surfaces every occurrence, the same way [entries] does across all keys. This is
     * what backs multi-value keys (HTTP `Set-Cookie`, repeated query params) once a caller
     * needs more than the collapsed single-value view.
     */
    fun getAll(key: A): List<B> = list.filter { it.first == key }.map { it.second }

    operator fun plus(item: Pair<A, B>): ListMap<A, B> = add(item)

    operator fun minus(key: A): ListMap<A, B> = remove(key)

    fun add(key: A, value: B): ListMap<A, B> = add(Pair(key, value))

    open fun add(item: Pair<A, B>): ListMap<A, B> {
        val newList = list.toMutableList()
        newList.add(item)
        return ListMap(newList)
    }

    open fun remove(key: A): ListMap<A, B> {
        val allowed = list.filter { it.first != key }
        return ListMap(allowed)
    }

    open fun clone(): ListMap<A, B> {
        val copies = list.map { Pair(it.first, it.second) }
        return ListMap(copies)
    }

    fun keys(): List<A> = list.map { it.first }

    fun values(): List<B> = list.map { it.second }

    fun entries(): List<Pair<A, B>> = list

    fun all(): List<B> = values()

    /**
     * Iterates every key/value pair, in order, with its position.
     */
    fun each(callback: (Int, A, B) -> Unit) {
        list.mapIndexed { index, pair -> callback(index, pair.first, pair.second) }
    }

    fun toMap(): Map<String, Any> = map.map { entry -> entry.key.toString() to list[entry.value].second as Any }.toMap()

    companion object {
        fun <A, B> convert(items: List<Pair<A, B>>): Map<A, Int> {
            val map = mutableMapOf<A, Int>()
            items.forEachIndexed { index, pair -> map[pair.first] = index }
            return map.toMap()
        }
    }
}
