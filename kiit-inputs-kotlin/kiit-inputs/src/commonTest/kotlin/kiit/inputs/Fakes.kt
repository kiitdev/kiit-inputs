@file:OptIn(ExperimentalUuidApi::class)

package kiit.inputs

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * Minimal test-only [Inputs]/[InputsUpdateable]/[Meta] implementation, backed by a plain
 * map of already-typed values (same "plain cast" contract as [RecordMap]). kiit-inputs ships
 * no general-purpose concrete Inputs implementation itself. That's `InputArgs`, which lives in
 * kiit-requests, so these fakes exist purely to exercise the interfaces' default methods.
 */
class FakeInputs(private val data: Map<String, Any?> = mapOf()) : Inputs, InputsUpdateable, Meta {
    override val raw: Any = data

    override fun get(key: String): Any? = data[key]

    override fun containsKey(key: String): Boolean = data.containsKey(key)

    override fun size(): Int = data.size

    override fun toMap(): Map<String, Any> = data.filterValues { it != null }.mapValues { it.value as Any }

    // Backed by a plain, single-value-per-key Map, so every key has at most one occurrence.
    override fun getAll(key: String): List<String> = data[key]?.let { listOf(it.toString()) } ?: emptyList()

    override fun add(key: String, value: Any): Inputs = FakeInputs(data + (key to value))

    override fun getString(key: String): String = data[key] as String

    override fun getBool(key: String): Boolean = data[key] as Boolean

    override fun getShort(key: String): Short = data[key] as Short

    override fun getInt(key: String): Int = data[key] as Int

    override fun getLong(key: String): Long = data[key] as Long

    override fun getFloat(key: String): Float = data[key] as Float

    override fun getDouble(key: String): Double = data[key] as Double

    override fun getInstant(key: String): Instant = data[key] as Instant

    override fun getLocalDate(key: String): LocalDate = data[key] as LocalDate

    override fun getLocalTime(key: String): LocalTime = data[key] as LocalTime

    override fun getLocalDateTime(key: String): LocalDateTime = data[key] as LocalDateTime

    override fun getUUID(key: String): Uuid = data[key] as Uuid
}

/**
 * Minimal test-only [Settings] implementation: an in-memory, mutable key-value store, used to
 * exercise Settings'/Puts' default methods (`edit`, `put`, overwrite semantics).
 */
class FakeSettings(private val data: MutableMap<String, Any?> = mutableMapOf()) : Settings {
    var editCalls = 0
        private set
    var initCalled = false
        private set
    var doneCalled = false
        private set

    override val raw: Any = data

    override fun get(key: String): Any? = data[key]

    override fun containsKey(key: String): Boolean = data.containsKey(key)

    override fun size(): Int = data.size

    override fun init() {
        initCalled = true
    }

    override fun done() {
        doneCalled = true
        editCalls += 1
    }

    override fun getString(key: String): String = data[key] as String

    override fun getBool(key: String): Boolean = data[key] as Boolean

    override fun getShort(key: String): Short = data[key] as Short

    override fun getInt(key: String): Int = data[key] as Int

    override fun getLong(key: String): Long = data[key] as Long

    override fun getFloat(key: String): Float = data[key] as Float

    override fun getDouble(key: String): Double = data[key] as Double

    override fun getInstant(key: String): Instant = data[key] as Instant

    override fun getLocalDate(key: String): LocalDate = data[key] as LocalDate

    override fun getLocalTime(key: String): LocalTime = data[key] as LocalTime

    override fun getLocalDateTime(key: String): LocalDateTime = data[key] as LocalDateTime

    override fun getUUID(key: String): Uuid = data[key] as Uuid

    override fun putString(key: String, value: String) {
        data[key] = value
    }

    override fun putBool(key: String, value: Boolean) {
        data[key] = value
    }

    override fun putShort(key: String, value: Short) {
        data[key] = value
    }

    override fun putInt(key: String, value: Int) {
        data[key] = value
    }

    override fun putLong(key: String, value: Long) {
        data[key] = value
    }

    override fun putFloat(key: String, value: Float) {
        data[key] = value
    }

    override fun putDouble(key: String, value: Double) {
        data[key] = value
    }

    override fun putInstant(key: String, value: Instant) {
        data[key] = value
    }

    override fun putLocalDate(key: String, value: LocalDate) {
        data[key] = value
    }

    override fun putLocalTime(key: String, value: LocalTime) {
        data[key] = value
    }

    override fun putLocalDateTime(key: String, value: LocalDateTime) {
        data[key] = value
    }

    override fun putUUID(key: String, value: Uuid) {
        data[key] = value
    }

    override fun putStringOrNull(key: String, value: String?) {
        data[key] = value
    }

    override fun putBoolOrNull(key: String, value: Boolean?) {
        data[key] = value
    }

    override fun putShortOrNull(key: String, value: Short?) {
        data[key] = value
    }

    override fun putIntOrNull(key: String, value: Int?) {
        data[key] = value
    }

    override fun putLongOrNull(key: String, value: Long?) {
        data[key] = value
    }

    override fun putFloatOrNull(key: String, value: Float?) {
        data[key] = value
    }

    override fun putDoubleOrNull(key: String, value: Double?) {
        data[key] = value
    }

    override fun putInstantOrNull(key: String, value: Instant?) {
        data[key] = value
    }

    override fun putLocalDateOrNull(key: String, value: LocalDate?) {
        data[key] = value
    }

    override fun putLocalTimeOrNull(key: String, value: LocalTime?) {
        data[key] = value
    }

    override fun putLocalDateTimeOrNull(key: String, value: LocalDateTime?) {
        data[key] = value
    }

    override fun putUUIDOrNull(key: String, value: Uuid?) {
        data[key] = value
    }
}
