plugins {
    id("maven-publish")
    id("java")
}

tasks.processResources {
    from("../build") {
        into("public")
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            groupId = "com.jongsoft.finance"
            artifactId = "pledger-ui"
            version = System.getProperty("version")
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