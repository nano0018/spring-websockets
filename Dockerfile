#
# Package stage
#
FROM openjdk:17
LABEL authors="nano0018"
EXPOSE 8080
RUN mkdir -p /app/
ADD build/libs/spring-websockets-0.0.1-SNAPSHOT.jar /app/demo.jar
ENTRYPOINT ["java","-jar","/app/demo.jar"]