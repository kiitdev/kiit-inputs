package kiit.inputs

/**
 * A key-value source where the same key can legitimately carry more than one value (HTTP
 * headers like `Set-Cookie`, repeated query-string params). [get] (from [Inputs]/[Gets])
 * still resolves to a single, last-write-wins value; `getAll` is the escape hatch for
 * callers that need every occurrence.
 */
interface Repeatable {
    fun getAll(key: String): List<String>
}
