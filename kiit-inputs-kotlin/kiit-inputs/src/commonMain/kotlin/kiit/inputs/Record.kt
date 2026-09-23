@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * Supplies default methods for reading inputs from a record-based (positionally addressable)
 * data structure — e.g. a DB row, where a column can be read by name or by index.
 */
interface Record : Inputs {

    fun getPos(name: String): Int
    fun getName(pos: Int): String
    fun contains(name: String): Boolean
    fun getString(pos: Int): String = getString(getName(pos))
    fun getBool(pos: Int): Boolean = getBool(getName(pos))
    fun getShort(pos: Int): Short = getShort(getName(pos))
    fun getInt(pos: Int): Int = getInt(getName(pos))
    fun getLong(pos: Int): Long = getLong(getName(pos))
    fun getFloat(pos: Int): Float = getFloat(getName(pos))
    fun getDouble(pos: Int): Double = getDouble(getName(pos))
    fun getInstant(pos: Int): Instant = getInstant(getName(pos))
    fun getLocalDate(pos: Int): LocalDate = getLocalDate(getName(pos))
    fun getLocalTime(pos: Int): LocalTime = getLocalTime(getName(pos))
    fun getLocalDateTime(pos: Int): LocalDateTime = getLocalDateTime(getName(pos))
    fun getUUID(pos: Int): Uuid = getUUID(getName(pos))
}
