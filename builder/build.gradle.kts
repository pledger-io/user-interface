plugins {
    id("java")
    id("maven-publish")
}

tasks.processResources {
    from("../build") {
        into("public")
    }
}

var user: String = findProperty("gpr.user") as String?: System.getenv("GITHUB_ACTOR")
var key: String = findProperty("gpr.key") as String?: System.getenv("GITHUB_TOKEN")

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