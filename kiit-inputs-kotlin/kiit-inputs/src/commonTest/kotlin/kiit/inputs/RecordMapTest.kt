@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

class RecordMapTest {
    private val uuid = Uuid.random()
    private val instant = Instant.parse("2024-03-05T10:15:30Z")
    private val date = LocalDate.parse("2024-03-05")
    private val time = LocalTime.parse("10:15:30")
    private val dateTime = LocalDateTime.parse("2024-03-05T10:15:30")

    private val record =
        RecordMap(
            ListMap(
                listOf(
                    "id" to 1,
                    "name" to "kiit",
                    "active" to true,
                    "uuid" to uuid,
                    "created" to instant,
                    "date" to date,
                    "time" to time,
                    "datetime" to dateTime,
                ),
            ),
        )

    @Test
    fun readsByNamePlainCast() {
        assertEquals(1, record.getInt("id"))
        assertEquals("kiit", record.getString("name"))
        assertTrue(record.getBool("active"))
        assertEquals(uuid, record.getUUID("uuid"))
        assertEquals(instant, record.getInstant("created"))
        assertEquals(date, record.getLocalDate("date"))
        assertEquals(time, record.getLocalTime("time"))
        assertEquals(dateTime, record.getLocalDateTime("datetime"))
    }

    @Test
    fun positionalAccessDelegatesToNameBasedAccess() {
        // "id" is position 0, "name" is position 1, per declaration order.
        assertEquals(1, record.getInt(0))
        assertEquals("kiit", record.getString(1))
    }

    @Test
    fun getPosAndGetNameRoundTrip() {
        assertEquals(0, record.getPos("id"))
        assertEquals("id", record.getName(0))
        assertEquals(1, record.getPos("name"))
        assertEquals("name", record.getName(1))
    }

    @Test
    fun containsChecksColumnPresence() {
        assertTrue(record.contains("name"))
        assertTrue(record.containsKey("name"))
    }

    @Test
    fun sizeReflectsColumnCount() {
        assertEquals(8, record.size())
    }

    @Test
    fun keysReflectsColumnNamesInOrder() {
        assertEquals(listOf("id", "name", "active", "uuid", "created", "date", "time", "datetime"), record.keys())
    }
}
