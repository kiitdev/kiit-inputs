package kiit.inputs

/**
 * Query/call arguments (query-string args, CLI flags used as arguments), as opposed to
 * [Meta]'s header-like settings. Same shape as [Meta] ([Inputs] + [Repeatable] + `toMap`),
 * kept as its own type rather than a typealias so the two aren't interchangeable by accident.
 */
interface Args : Inputs, Repeatable {
    fun toMap(): Map<String, String>
}
