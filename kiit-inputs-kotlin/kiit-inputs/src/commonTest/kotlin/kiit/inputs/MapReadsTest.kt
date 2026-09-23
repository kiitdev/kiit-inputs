@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

class MapReadsTest {

    private val uuid = Uuid.random()
    private val reads = MapReads(
        mapOf(
            "str" to "hello",
            "bool" to "true",
            "short" to "7",
            "int" to "42",
            "long" to "9999999999",
            "float" to "1.5",
            "double" to "2.25",
            "instant" to "2024-03-05T10:15:30Z",
            "date" to "2024-03-05",
            "time" to "10:15:30",
            "datetime" to "2024-03-05T10:15:30",
            "uuid" to uuid.toString(),
        )
    )

    @Test
    fun readsTypedValues() {
        assertEquals("hello", reads.getString("str"))
        assertTrue(reads.getBool("bool"))
        assertEquals(7.toShort(), reads.getShort("short"))
        assertEquals(42, reads.getInt("int"))
        assertEquals(9999999999L, reads.getLong("long"))
        assertEquals(1.5f, reads.getFloat("float"))
        assertEquals(2.25, reads.getDouble("double"))
        assertEquals(Instant.parse("2024-03-05T10:15:30Z"), reads.getInstant("instant"))
        assertEquals(LocalDate.parse("2024-03-05"), reads.getLocalDate("date"))
        assertEquals(LocalTime.parse("10:15:30"), reads.getLocalTime("time"))
        assertEquals(LocalDateTime.parse("2024-03-05T10:15:30"), reads.getLocalDateTime("datetime"))
        assertEquals(uuid, reads.getUUID("uuid"))
    }

    @Test
    fun containsKeyAndSize() {
        assertTrue(reads.containsKey("str"))
        assertFalse(reads.containsKey("missing"))
        assertEquals(12, reads.size())
    }

    @Test
    fun orNullReturnsNullWhenMissing() {
        assertEquals("hello", reads.getStringOrNull("str"))
        assertNull(reads.getStringOrNull("missing"))
        assertNull(reads.getIntOrNull("missing"))
    }

    @Test
    fun orElseReturnsDefaultWhenMissing() {
        assertEquals(42, reads.getIntOrElse("int", -1))
        assertEquals(-1, reads.getIntOrElse("missing", -1))
        assertEquals("fallback", reads.getStringOrElse("missing", "fallback"))
    }

    @Test
    fun emptyMapReadsHaveZeroSize() {
        val empty = MapReads()
        assertEquals(0, empty.size())
        assertFalse(empty.containsKey("anything"))
    }
}
