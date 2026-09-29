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
 * config settings, DB records, etc.) by name.
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
    fun getStringOrNull(key: String): String? = getOrNull(key, ::getString)

    fun getBoolOrNull(key: String): Boolean? = getOrNull(key, ::getBool)

    fun getShortOrNull(key: String): Short? = getOrNull(key, ::getShort)

    fun getIntOrNull(key: String): Int? = getOrNull(key, ::getInt)

    fun getLongOrNull(key: String): Long? = getOrNull(key, ::getLong)

    fun getFloatOrNull(key: String): Float? = getOrNull(key, ::getFloat)

    fun getDoubleOrNull(key: String): Double? = getOrNull(key, ::getDouble)

    fun getInstantOrNull(key: String): Instant? = getOrNull(key, ::getInstant)

    fun getLocalDateOrNull(key: String): LocalDate? = getOrNull(key, ::getLocalDate)

    fun getLocalTimeOrNull(key: String): LocalTime? = getOrNull(key, ::getLocalTime)

    fun getLocalDateTimeOrNull(key: String): LocalDateTime? = getOrNull(key, ::getLocalDateTime)

    fun getUUIDOrNull(key: String): Uuid? = getOrNull(key) { k: String -> Uuid.parse(getString(k)) }

    // Get value or default
    fun getStringOrElse(key: String, default: String): String = getOrElse(key, ::getString, default)

    fun getBoolOrElse(key: String, default: Boolean): Boolean = getOrElse(key, ::getBool, default)

    fun getShortOrElse(key: String, default: Short): Short = getOrElse(key, ::getShort, default)

    fun getIntOrElse(key: String, default: Int): Int = getOrElse(key, ::getInt, default)

    fun getLongOrElse(key: String, default: Long): Long = getOrElse(key, ::getLong, default)

    fun getFloatOrElse(key: String, default: Float): Float = getOrElse(key, ::getFloat, default)

    fun getDoubleOrElse(key: String, default: Double): Double = getOrElse(key, ::getDouble, default)

    fun getInstantOrElse(key: String, default: Instant): Instant = getOrElse(key, ::getInstant, default)

    fun getLocalDateOrElse(key: String, default: LocalDate): LocalDate = getOrElse(key, ::getLocalDate, default)

    fun getLocalTimeOrElse(key: String, default: LocalTime): LocalTime = getOrElse(key, ::getLocalTime, default)

    fun getLocalDateTimeOrElse(key: String, default: LocalDateTime): LocalDateTime {
        return getOrElse(key, ::getLocalDateTime, default)
    }

    fun getUUIDOrElse(key: String, default: Uuid): Uuid {
        return getOrElse(key, { k: String -> Uuid.parse(getString(k)) }, default)
    }

    fun <T> getOrNull(key: String, fetcher: (String) -> T): T?

    fun <T> getOrElse(key: String, fetcher: (String) -> T, default: T): T
}
