## Use a base image with Maven to build the project
#FROM maven:3.8.3-openjdk-17-slim AS build
## Set the working directory in the container
#WORKDIR /app
## Copy the Maven project files to the container
#COPY . .
## Build the Spring Boot application
#RUN mvn clean package -DskipTests
#
#
## Use Alpine Linux as the final base image
#FROM openjdk:17-slim
## Set the working directory in the container
#WORKDIR /app
## Copy the built JAR file from the build container to the Alpine container
#COPY --from=build /app/target/movie-theater-api.jar .
## Expose the port your Spring Boot app will run on (if needed)
#EXPOSE 8080
## Command to run your Spring Boot applgit ication
#ENTRYPOINT ["java", "-jar", "movie-theater-api.jar"]



FROM maven:3.8.3-openjdk-17-slim
WORKDIR /app
COPY . .
EXPOSE 8080
RUN mvn install
ENTRYPOINT ["mvn", "spring-boot:run"]
