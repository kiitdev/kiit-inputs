// Root aggregator, no dependencies of its own.
// The library lives in :kiit-inputs, demo apps live under :samples.
plugins {
    idea
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.kotlinMultiplatform) apply false
    alias(libs.plugins.androidLibrary) apply false
    alias(libs.plugins.vanniktech.mavenPublish) apply false
    alias(libs.plugins.ktlint) apply false
    alias(libs.plugins.detekt) apply false
    alias(libs.plugins.dokka) apply false
    alias(libs.plugins.kover) apply false
    alias(libs.plugins.skie) apply false
}

// Keeps IntelliJ from indexing the non-Gradle Swift sample. Gradle itself already ignores it,
// it isn't included in settings.gradle.kts.
idea {
    module {
        excludeDirs.addAll(
            listOf(
                file("samples/sample-swift"),
            ),
        )
    }
}
