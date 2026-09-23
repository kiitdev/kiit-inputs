plugins {
    alias(libs.plugins.kotlin.jvm)
    application
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass = "sample.SampleKt"
}

dependencies {
    // kiit-inputs has no serialization surface and no suspend functions, so this sample needs
    // nothing beyond the module itself.
    implementation(project(":kiit-inputs"))
}
