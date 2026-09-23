package kiit.inputs

interface InputsUpdateable {
    // Immutable add. Returns a new Inputs, does not mutate the receiver.
    fun add(key: String, value: Any): Inputs
}

/**
 * Read access to key-value data from multiple sources: CLI arguments, config settings,
 * HTTP requests, in-memory settings. Abstracts the source so higher-level code (e.g.
 * kiit-requests) doesn't need to know where the data actually came from.
 */
interface Inputs : Gets {
    // Underlying raw backing value, must be supplied by derived classes.
    val raw: Any

    fun get(key: String): Any?

    fun containsKey(key: String): Boolean

    fun size(): Int

    override fun <T> getOrNull(key: String, fetcher: (String) -> T): T? {
        return if (containsKey(key)) {
            val v = get(key)
            v?.let { fetcher(key) }
        } else {
            null
        }
    }

    override fun <T> getOrElse(key: String, fetcher: (String) -> T, default: T): T {
        return if (containsKey(key)) fetcher(key) else default
    }
}
