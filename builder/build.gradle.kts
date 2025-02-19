plugins {
    id("java")
    id("maven-publish")
}

tasks.processResources {
    from("../dist") {
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
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
}