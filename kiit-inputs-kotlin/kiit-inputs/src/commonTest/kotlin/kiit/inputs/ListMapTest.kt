package kiit.inputs

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ListMapTest {

    @Test
    fun getByKeyAndByPosition() {
        val m = ListMap(listOf("a" to 1, "b" to 2, "c" to 3))
        assertEquals(1, m["a"])
        assertEquals(2, m["b"])
        assertNull(m["missing"])
        assertEquals(1, m.getAt(0))
        assertEquals(3, m.getAt(2))
    }

    @Test
    fun containsAndSize() {
        val m = ListMap(listOf("a" to 1, "b" to 2))
        assertTrue(m.contains("a"))
        assertFalse(m.contains("z"))
        assertEquals(2, m.size)
    }

    @Test
    fun addReturnsNewInstanceWithoutMutatingOriginal() {
        val original = ListMap(listOf("a" to 1))
        val updated = original.add("b", 2)

        assertEquals(1, original.size)
        assertEquals(2, updated.size)
        assertNull(original["b"])
        assertEquals(2, updated["b"])
    }

    @Test
    fun removeReturnsNewInstanceWithoutMutatingOriginal() {
        val original = ListMap(listOf("a" to 1, "b" to 2))
        val updated = original.remove("a")

        assertEquals(2, original.size)
        assertEquals(1, updated.size)
        assertTrue(original.contains("a"))
        assertFalse(updated.contains("a"))
    }

    @Test
    fun duplicateKeysKeepLastValueForKeyLookupButAllEntriesInIteration() {
        val m = ListMap(listOf("a" to 1, "a" to 2))
        assertEquals(2, m["a"]) // last write wins for key lookup
        assertEquals(listOf(1, 2), m.values()) // but both entries survive in iteration
        assertEquals(2, m.size)
    }

    @Test
    fun keysValuesEntriesAndAll() {
        val m = ListMap(listOf("a" to 1, "b" to 2))
        assertEquals(listOf("a", "b"), m.keys())
        assertEquals(listOf(1, 2), m.values())
        assertEquals(listOf("a" to 1, "b" to 2), m.entries())
        assertEquals(listOf(1, 2), m.all())
    }

    @Test
    fun eachIteratesInOrderWithIndex() {
        val m = ListMap(listOf("a" to 1, "b" to 2))
        val seen = mutableListOf<Triple<Int, String, Int>>()
        m.each { i, k, v -> seen.add(Triple(i, k, v)) }
        assertEquals(listOf(Triple(0, "a", 1), Triple(1, "b", 2)), seen)
    }

    @Test
    fun emptyListMapHasZeroSize() {
        val m = ListMap<String, Int>()
        assertEquals(0, m.size)
        assertNull(m["anything"])
    }
}
