package kiit.inputs

/**
 * Provides both gets (reads) and puts (writes) on configurable settings.
 */
interface Settings : Inputs, Puts {

    /**
     * Convenience method to bracket a batch of edits with init()/done().
     */
    fun edit(op: () -> Unit) {
        init()
        op()
        done()
    }

    /**
     * Begins a batch of edits. (Matches Android SharedPreferences' edit-transaction shape,
     * so a Settings implementation can wrap it directly.)
     */
    fun init()

    /**
     * Completes a batch of edits.
     */
    fun done()

    fun put(key: String, value: String, overwrite: Boolean = false) {
        if (!containsKey(key) || overwrite) {
            putString(key, value)
        }
    }
}
