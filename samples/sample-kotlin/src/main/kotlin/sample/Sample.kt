package sample

import kiit.inputs.Gets
import kiit.inputs.Inputs
import kiit.inputs.InputsUpdateable
import kiit.inputs.ListMap
import kiit.inputs.MapReads
import kiit.inputs.Metadata
import kiit.inputs.RecordMap
import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalTime
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * MapReads: the simplest way to get typed access to a plain Map, e.g. request query
 * parameters or CLI flags already parsed into strings.
 */
fun mapReadsExample() {
    val query = MapReads(mapOf("name" to "kiit", "count" to "3", "active" to "true"))
    println("name=${query.getString("name")} count=${query.getInt("count")} active=${query.getBool("active")}")
    println("missing key -> ${query.getStringOrElse("missing", "(default)")}")
}

/**
 * RecordMap: positional + name-based access, the shape a DB row (or anything else
 * addressable by both column name and index) needs.
 */
fun recordMapExample() {
    val row = RecordMap(
        ListMap(
            listOf(
                "id" to 1,
                "name" to "kiit",
                "active" to true,
            )
        )
    )
    println("by name: id=${row.getInt("id")}, name=${row.getString("name")}")
    println("by position: id=${row.getInt(0)}, name=${row.getString(1)}")
}

/**
 * A minimal custom Inputs implementation. Shows what a host (an HTTP framework adapter, a
 * CLI parser, etc.) needs to provide to plug into kiit-inputs. Values are stored pre-typed
 * here for simplicity; a real host reading raw strings would parse them in these getters.
 */
@OptIn(ExperimentalUuidApi::class)
private class SimpleInputs(private val data: Map<String, Any?>) : Inputs, InputsUpdateable, Metadata {
    override val raw: Any = data
    override fun get(key: String): Any? = data[key]
    override fun containsKey(key: String): Boolean = data.containsKey(key)
    override fun size(): Int = data.size
    override fun toMap(): Map<String, Any> = data.filterValues { it != null }.mapValues { it.value as Any }
    override fun add(key: String, value: Any): Inputs = SimpleInputs(data + (key to value))

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

fun customInputsExample() {
    val original: Gets = SimpleInputs(mapOf("env" to "prod"))
    val updated = (original as InputsUpdateable).add("region", "us-east-1")

    println("original has region? ${(original as Inputs).containsKey("region")}")
    println("updated has region? ${updated.containsKey("region")}")
    println("updated as map: ${(updated as Metadata).toMap()}")
}

fun main() {
    mapReadsExample()
    recordMapExample()
    customInputsExample()
}
