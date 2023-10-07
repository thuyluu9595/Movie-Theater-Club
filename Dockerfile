#FROM openjdk:17
#LABEL authors="huyduong"
#EXPOSE 8080
#ADD target/movie-theater-api.jar movie-theater-api.jar
#
#ENTRYPOINT ["java", "-jar", "/movie-theater-api.jar"]

# Use a base image with Maven to build the project
FROM maven:3.8.3-openjdk-17-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files to the container
COPY . .

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Use Alpine Linux as the final base image
FROM openjdk:17-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file from the build container to the Alpine container
COPY --from=build /app/target/movie-theater-api.jar .
#COPY start.sh .
#COPY wait-for.sh .

# Expose the port your Spring Boot app will run on (if needed)
EXPOSE 8080
#RUN chmod +x start.sh
#RUN chmod +x wait-for.sh

# Command to run your Spring Boot application
ENTRYPOINT ["java", "-jar", "movie-theater-api.jar"]
