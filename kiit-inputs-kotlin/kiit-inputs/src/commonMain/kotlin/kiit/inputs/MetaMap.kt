@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * A [Meta] backed by a [ListMap] of raw wire-format strings (HTTP header values, CLI flag
 * values are always strings, never pre-typed). Typed getters parse the string, the same
 * convention [MapReads] uses, unlike [RecordMap]'s plain casts over already-typed values.
 * `get`/`getString`/etc. resolve to the last value for a key; [getAll] returns every value,
 * for keys that legitimately repeat (`Set-Cookie`, repeated query params).
 */
class MetaMap(private val rs: ListMap<String, String>) : Meta {
    override val raw: Any = rs

    override fun size(): Int = rs.size

    override fun get(key: String): Any? = rs.get(key)

    override fun containsKey(key: String): Boolean = rs.contains(key)

    override fun keys(): List<String> = rs.keys().distinct()

    override fun getAll(key: String): List<String> = rs.getAll(key)

    override fun toMap(): Map<String, Any> = rs.keys().distinct().associateWith { key -> rs.get(key) as Any }

    override fun getString(key: String): String = getStringRaw(key)

    override fun getBool(key: String): Boolean = getStringRaw(key).toBoolean()

    override fun getShort(key: String): Short = getStringRaw(key).toShort()

    override fun getInt(key: String): Int = getStringRaw(key).toInt()

    override fun getLong(key: String): Long = getStringRaw(key).toLong()

    override fun getFloat(key: String): Float = getStringRaw(key).toFloat()

    override fun getDouble(key: String): Double = getStringRaw(key).toDouble()

    override fun getUUID(key: String): Uuid = Uuid.parse(getStringRaw(key))

    override fun getInstant(key: String): Instant = Instant.parse(getStringRaw(key))

    override fun getLocalDate(key: String): LocalDate = LocalDate.parse(getStringRaw(key))

    override fun getLocalTime(key: String): LocalTime = LocalTime.parse(getStringRaw(key))

    override fun getLocalDateTime(key: String): LocalDateTime = LocalDateTime.parse(getStringRaw(key))

    private fun getStringRaw(key: String): String = rs.get(key)?.trim() ?: ""
}
