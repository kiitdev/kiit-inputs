package kiit.inputs

interface Metadata : Inputs {
    fun toMap(): Map<String, Any>
}
