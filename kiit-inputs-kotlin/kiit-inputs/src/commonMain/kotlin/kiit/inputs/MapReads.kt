package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime

/**
 * Simple in-memory, read-only [Gets] backed by a plain Map. Mostly useful for tests and
 * prototyping, not a production data source.
 */
class MapReads(private val data: Map<String, Any?> = mapOf()) : Gets {
    fun size(): Int = data.size

    fun get(key: String): Any? = data[key]

    fun containsKey(key: String): Boolean = data.containsKey(key)

    override fun getString(key: String): String = getStringRaw(key)

    override fun getBool(key: String): Boolean = getStringRaw(key).toBoolean()

    override fun getShort(key: String): Short = getStringRaw(key).toShort()

    override fun getInt(key: String): Int = getStringRaw(key).toInt()

    override fun getLong(key: String): Long = getStringRaw(key).toLong()

    override fun getFloat(key: String): Float = getStringRaw(key).toFloat()

    override fun getDouble(key: String): Double = getStringRaw(key).toDouble()

    override fun getInstant(key: String): Instant = Instant.parse(getStringRaw(key))

    override fun getLocalDate(key: String): LocalDate = LocalDate.parse(getStringRaw(key))

    override fun getLocalTime(key: String): LocalTime = LocalTime.parse(getStringRaw(key))

    override fun getLocalDateTime(key: String): LocalDateTime = LocalDateTime.parse(getStringRaw(key))

    override fun <T> getOrNull(key: String, fetcher: (String) -> T): T? {
        return if (containsKey(key)) {
            val v = get(key)
            v?.let { fetcher(key) }
        } else {
            null
        }
    }

    override fun <T> getOrElse(key: String, fetcher: (String) -> T, default: T): T {
        return if (containsKey(key)) fetcher(key) else default
    }

    private fun getStringRaw(key: String): String = data[key]?.toString()?.trim() ?: ""
}
