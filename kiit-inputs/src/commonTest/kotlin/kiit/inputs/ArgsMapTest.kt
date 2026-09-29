package kiit.inputs

import kotlin.test.Test
import kotlin.test.assertEquals

/**
 * [ArgsMap] shares its whole implementation with [MetaMap] via [ListMapReads] (see
 * [MetaMapTest] for full read-behavior coverage). This just checks [ArgsMap] itself works, and
 * isn't secretly interchangeable with [Meta].
 */
class ArgsMapTest {
    @Test
    fun behavesLikeAnInputsAndRepeatable() {
        val args = ArgsMap(ListMap(listOf("tag" to "a", "tag" to "b", "page" to "2")))
        assertEquals(2, args.getInt("page"))
        assertEquals("b", args.getString("tag"))
        assertEquals(listOf("a", "b"), args.getAll("tag"))
        assertEquals(mapOf("tag" to "b", "page" to "2"), args.toMap())
    }

    @Test
    fun isNotAMeta() {
        val args: Args = ArgsMap(ListMap(listOf("a" to "1")))
        assertEquals(false, args is Meta)
    }
}
