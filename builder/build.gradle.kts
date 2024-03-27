plugins {
    id("java")
    id("maven-publish")
}

tasks.processResources {
    from("../build") {
        into("public")
    }
}

var user: String = project.properties["gpr.user"] as String?: System.getenv("GITHUB_ACTOR")
var key: String = project.properties["gpr.key"] as String?: System.getenv("GITHUB_ACTOR")

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
                username = user
                password = key
            }
        }
    }
}