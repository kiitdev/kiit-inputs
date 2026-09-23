package kiit.inputs

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

class InputsTest {

    @Test
    fun getOrNullChecksContainsKeyFirst() {
        val inputs = FakeInputs(mapOf("name" to "kiit", "count" to 3))
        assertEquals("kiit", inputs.getStringOrNull("name"))
        assertEquals(3, inputs.getIntOrNull("count"))
        assertNull(inputs.getStringOrNull("missing"))
    }

    @Test
    fun getOrElseChecksContainsKeyFirst() {
        val inputs = FakeInputs(mapOf("count" to 3))
        assertEquals(3, inputs.getIntOrElse("count", -1))
        assertEquals(-1, inputs.getIntOrElse("missing", -1))
    }

    @Test
    fun containsKeySizeAndGet() {
        val inputs = FakeInputs(mapOf("a" to 1, "b" to 2))
        assertTrue(inputs.containsKey("a"))
        assertFalse(inputs.containsKey("z"))
        assertEquals(2, inputs.size())
        assertEquals(1, inputs.get("a"))
        assertNull(inputs.get("z"))
    }
}

class InputsUpdateableTest {

    @Test
    fun addReturnsNewInstanceWithoutMutatingOriginal() {
        val original = FakeInputs(mapOf("a" to 1))
        val updated = original.add("b", 2)

        assertEquals(1, original.size())
        assertFalse(original.containsKey("b"))

        assertEquals(2, updated.size())
        assertTrue(updated.containsKey("a"))
        assertTrue(updated.containsKey("b"))
    }

    @Test
    fun addOverwritingExistingKeyReplacesValue() {
        val original = FakeInputs(mapOf("a" to 1))
        val updated = original.add("a", 99)

        assertEquals(1, original.get("a"))
        assertEquals(99, updated.get("a"))
    }
}

class MetadataTest {

    @Test
    fun toMapReflectsUnderlyingData() {
        val meta = FakeInputs(mapOf("x" to 1, "y" to "two"))
        assertEquals(mapOf("x" to 1, "y" to "two"), meta.toMap())
    }

    @Test
    fun toMapOnEmptyInputsIsEmpty() {
        assertEquals(emptyMap(), FakeInputs().toMap())
    }
}
