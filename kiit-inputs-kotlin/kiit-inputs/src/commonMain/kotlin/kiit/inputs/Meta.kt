package kiit.inputs

/**
 * Header-like metadata about a call (HTTP headers, CLI flags, queue attributes), rather than
 * its payload. Combines [Inputs] (single, last-write-wins value per key) with [Repeatable]
 * (every value for keys that legitimately repeat, e.g. `Set-Cookie`).
 */
interface Meta : Inputs, Repeatable {
    fun toMap(): Map<String, String>
}
