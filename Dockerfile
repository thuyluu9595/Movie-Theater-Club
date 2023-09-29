FROM openjdk:17
LABEL authors="huyduong"
EXPOSE 8080
ADD target/movie-theater-api.jar movie-theater-api.jar

ENTRYPOINT ["java", "-jar", "/movie-theater-api.jar"]