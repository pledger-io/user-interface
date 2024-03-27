plugins {
    id("java")
    id("maven-publish")
}

tasks.processResources {
    from("../build") {
        into("public")
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            logger.lifecycle("Publishing with version $version")
            groupId = "com.jongsoft.finance"
            from(components["java"])
        }
    }

    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/pledger-io/user-interface")
            credentials {
                username = providers.gradleProperty("gpr.user").get() ?: System.getenv("GITHUB_ACTOR")
                password = providers.gradleProperty("gpr.key").get() ?: System.getenv("GITHUB_TOKEN")
            }
        }
    }
}