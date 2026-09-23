@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * Read-only, typed access to a key-value data source (HTTP request inputs, CLI flags,
 * config settings, DB records, ...) by name.
 */
interface Gets {
    fun getString(key: String): String
    fun getBool(key: String): Boolean
    fun getShort(key: String): Short
    fun getInt(key: String): Int
    fun getLong(key: String): Long
    fun getFloat(key: String): Float
    fun getDouble(key: String): Double
    fun getInstant(key: String): Instant
    fun getLocalDate(key: String): LocalDate
    fun getLocalTime(key: String): LocalTime
    fun getLocalDateTime(key: String): LocalDateTime
    fun getUUID(key: String): Uuid = Uuid.parse(getString(key))

    // Get values as Option[T]
    fun getStringOrNull(key: String): String? = getOrNull(key) { k: String -> getString(k) }
    fun getBoolOrNull(key: String): Boolean? = getOrNull(key) { k: String -> getBool(k) }
    fun getShortOrNull(key: String): Short? = getOrNull(key) { k: String -> getShort(k) }
    fun getIntOrNull(key: String): Int? = getOrNull(key) { k: String -> getInt(k) }
    fun getLongOrNull(key: String): Long? = getOrNull(key) { k: String -> getLong(k) }
    fun getFloatOrNull(key: String): Float? = getOrNull(key) { k: String -> getFloat(k) }
    fun getDoubleOrNull(key: String): Double? = getOrNull(key) { k: String -> getDouble(k) }
    fun getInstantOrNull(key: String): Instant? = getOrNull(key) { k: String -> getInstant(k) }
    fun getLocalDateOrNull(key: String): LocalDate? = getOrNull(key) { k: String -> getLocalDate(k) }
    fun getLocalTimeOrNull(key: String): LocalTime? = getOrNull(key) { k: String -> getLocalTime(k) }
    fun getLocalDateTimeOrNull(key: String): LocalDateTime? = getOrNull(key) { k: String -> getLocalDateTime(k) }
    fun getUUIDOrNull(key: String): Uuid? = getOrNull(key) { k: String -> Uuid.parse(getString(k)) }

    // Get value or default
    fun getStringOrElse(key: String, default: String): String = getOrElse(key, { k: String -> getString(k) }, default)
    fun getBoolOrElse(key: String, default: Boolean): Boolean = getOrElse(key, { k: String -> getBool(k) }, default)
    fun getShortOrElse(key: String, default: Short): Short = getOrElse(key, { k: String -> getShort(k) }, default)
    fun getIntOrElse(key: String, default: Int): Int = getOrElse(key, { k: String -> getInt(k) }, default)
    fun getLongOrElse(key: String, default: Long): Long = getOrElse(key, { k: String -> getLong(k) }, default)
    fun getFloatOrElse(key: String, default: Float): Float = getOrElse(key, { k: String -> getFloat(k) }, default)
    fun getDoubleOrElse(key: String, default: Double): Double = getOrElse(key, { k: String -> getDouble(k) }, default)
    fun getInstantOrElse(key: String, default: Instant): Instant =
        getOrElse(key, { k: String -> getInstant(k) }, default)

    fun getLocalDateOrElse(key: String, default: LocalDate): LocalDate =
        getOrElse(key, { k: String -> getLocalDate(k) }, default)

    fun getLocalTimeOrElse(key: String, default: LocalTime): LocalTime =
        getOrElse(key, { k: String -> getLocalTime(k) }, default)

    fun getLocalDateTimeOrElse(key: String, default: LocalDateTime): LocalDateTime =
        getOrElse(key, { k: String -> getLocalDateTime(k) }, default)

    fun getUUIDOrElse(key: String, default: Uuid): Uuid =
        getOrElse(key, { k: String -> Uuid.parse(getString(k)) }, default)

    fun <T> getOrNull(key: String, fetcher: (String) -> T): T?
    fun <T> getOrElse(key: String, fetcher: (String) -> T, default: T): T
}
