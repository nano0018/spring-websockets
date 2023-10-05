#
# Build stage
#

FROM gradle:jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon


#
# Package stage
#

FROM openjdk:17

EXPOSE 8080

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/spring-websockets-0.0.1-SNAPSHOT.jar /app/demo.jar
ENTRYPOINT ["java","-jar","/app/demo.jar"]