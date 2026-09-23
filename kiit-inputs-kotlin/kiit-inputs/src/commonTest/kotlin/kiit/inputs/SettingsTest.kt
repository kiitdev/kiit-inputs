package kiit.inputs

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SettingsTest {

    @Test
    fun putThenGetRoundTrips() {
        val settings = FakeSettings()
        settings.putString("name", "kiit")
        settings.putInt("count", 42)

        assertEquals("kiit", settings.getString("name"))
        assertEquals(42, settings.getInt("count"))
    }

    @Test
    fun putDoesNotOverwriteByDefault() {
        val settings = FakeSettings()
        settings.put("name", "first")
        settings.put("name", "second")

        assertEquals("first", settings.getString("name"))
    }

    @Test
    fun putOverwritesWhenExplicitlyAllowed() {
        val settings = FakeSettings()
        settings.put("name", "first")
        settings.put("name", "second", overwrite = true)

        assertEquals("second", settings.getString("name"))
    }

    @Test
    fun editBracketsWithInitAndDone() {
        val settings = FakeSettings()
        settings.edit {
            settings.putString("name", "kiit")
        }

        assertTrue(settings.initCalled)
        assertTrue(settings.doneCalled)
        assertEquals(1, settings.editCalls)
        assertEquals("kiit", settings.getString("name"))
    }
}
