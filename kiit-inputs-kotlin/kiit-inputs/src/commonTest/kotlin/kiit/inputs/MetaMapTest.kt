package kiit.inputs

import kotlin.test.Test
import kotlin.test.assertEquals

class MetaMapTest {
    @Test
    fun getParsesRawStringsByType() {
        val meta = MetaMap(ListMap(listOf("count" to "3", "active" to "true")))
        assertEquals(3, meta.getInt("count"))
        assertEquals(true, meta.getBool("active"))
    }

    @Test
    fun getResolvesToLastValueForARepeatedKey() {
        val meta = MetaMap(ListMap(listOf("Set-Cookie" to "a=1", "Set-Cookie" to "b=2")))
        assertEquals("b=2", meta.getString("Set-Cookie"))
    }

    @Test
    fun getAllReturnsEveryValueForARepeatedKey() {
        val meta = MetaMap(ListMap(listOf("Set-Cookie" to "a=1", "Set-Cookie" to "b=2")))
        assertEquals(listOf("a=1", "b=2"), meta.getAll("Set-Cookie"))
    }

    @Test
    fun getAllOnAMissingKeyIsEmpty() {
        val meta = MetaMap(ListMap(listOf("a" to "1")))
        assertEquals(emptyList(), meta.getAll("missing"))
    }

    @Test
    fun toMapCollapsesRepeatedKeysToTheLastValue() {
        val meta = MetaMap(ListMap(listOf("Set-Cookie" to "a=1", "Set-Cookie" to "b=2", "Content-Type" to "text/plain")))
        assertEquals(mapOf("Set-Cookie" to "b=2", "Content-Type" to "text/plain"), meta.toMap())
    }

    @Test
    fun containsKeyAndSize() {
        val meta = MetaMap(ListMap(listOf("a" to "1", "b" to "2")))
        assertEquals(2, meta.size())
        assertEquals(true, meta.containsKey("a"))
        assertEquals(false, meta.containsKey("z"))
    }
}
