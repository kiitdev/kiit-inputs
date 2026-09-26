@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * A [Record] backed by a [ListMap] of raw values. Every getter is a plain cast. The raw
 * value stored at a key is assumed to already be the target type (an [Instant], not a
 * platform-specific value like a JDBC `java.sql.Timestamp`). Converting a source-specific
 * value into the corresponding kiit-inputs type is the responsibility of whatever populates
 * this ListMap in the first place (e.g. a future DB-record-reading module), not of RecordMap.
 * That keeps every getter here the same shape instead of special-casing dates.
 */
class RecordMap(private val rs: ListMap<String, Any?>) : Record {
    override val raw: Any = rs

    override fun size(): Int = rs.size

    override fun get(key: String): Any? = rs.get(key)

    override fun getPos(name: String): Int = rs.keys().indexOf(name)

    override fun getName(pos: Int): String = rs.keys()[pos]

    override fun contains(name: String): Boolean = rs.contains(name)

    override fun containsKey(key: String): Boolean = rs.contains(key)

    override fun keys(): List<String> = rs.keys().distinct()

    override fun getString(key: String): String = rs.get(key) as String

    override fun getBool(key: String): Boolean = rs.get(key) as Boolean

    override fun getShort(key: String): Short = rs.get(key) as Short

    override fun getInt(key: String): Int = rs.get(key) as Int

    override fun getLong(key: String): Long = rs.get(key) as Long

    override fun getFloat(key: String): Float = rs.get(key) as Float

    override fun getDouble(key: String): Double = rs.get(key) as Double

    override fun getUUID(key: String): Uuid = rs.get(key) as Uuid

    override fun getInstant(key: String): Instant = rs.get(key) as Instant

    override fun getLocalDate(key: String): LocalDate = rs.get(key) as LocalDate

    override fun getLocalTime(key: String): LocalTime = rs.get(key) as LocalTime

    override fun getLocalDateTime(key: String): LocalDateTime = rs.get(key) as LocalDateTime
}
