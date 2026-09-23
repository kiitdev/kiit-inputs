@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * Write access mirroring [Gets], secondary to reading. Used by config/settings-style
 * consumers (e.g. mobile app settings) that need to persist values, not just read them.
 */
interface Puts {
    fun putString(key: String, value: String)

    fun putBool(key: String, value: Boolean)

    fun putShort(key: String, value: Short)

    fun putInt(key: String, value: Int)

    fun putLong(key: String, value: Long)

    fun putFloat(key: String, value: Float)

    fun putDouble(key: String, value: Double)

    fun putInstant(key: String, value: Instant)

    fun putLocalDate(key: String, value: LocalDate)

    fun putLocalTime(key: String, value: LocalTime)

    fun putLocalDateTime(key: String, value: LocalDateTime)

    fun putUUID(key: String, value: Uuid)

    // put values as Option[T]
    fun putStringOrNull(key: String, value: String?)

    fun putBoolOrNull(key: String, value: Boolean?)

    fun putShortOrNull(key: String, value: Short?)

    fun putIntOrNull(key: String, value: Int?)

    fun putLongOrNull(key: String, value: Long?)

    fun putFloatOrNull(key: String, value: Float?)

    fun putDoubleOrNull(key: String, value: Double?)

    fun putInstantOrNull(key: String, value: Instant?)

    fun putLocalDateOrNull(key: String, value: LocalDate?)

    fun putLocalTimeOrNull(key: String, value: LocalTime?)

    fun putLocalDateTimeOrNull(key: String, value: LocalDateTime?)

    fun putUUIDOrNull(key: String, value: Uuid?)
}
