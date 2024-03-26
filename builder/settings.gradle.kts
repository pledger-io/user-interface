rootProject.name = "pledger-ui"

pluginManagement {
    plugins {
        id("java")
        id("io.micronaut.library").version("4.3.4")

        id("signing")
        id("maven-publish")
    }
}

dependencyResolutionManagement {
    @Suppress("UnstableApiUsage") // It's gradle, any of their APIs can be considered unstable
    repositories {
        mavenCentral()
    }
}