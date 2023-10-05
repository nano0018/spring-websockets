#
# Package stage
#
FROM openjdk:17
EXPOSE 8080
RUN mkdir -p /app/
CMD ["./gradlew", "clean", "bootJar"]
ADD build/libs/spring-websockets-0.0.1-SNAPSHOT.jar /app/demo.jar
ENTRYPOINT ["java","-jar","/app/demo.jar"]