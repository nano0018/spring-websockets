#
# Package stage
#
#Build stage

FROM gradle:latest AS BUILD
WORKDIR /usr/app/
COPY . .
RUN gradle build

FROM openjdk:17
LABEL authors="nano0018"
ENV JAR_NAME=spring-websockets-0.0.1-SNAPSHOT.jar
WORKDIR $APP_HOME
COPY --from=BUILD $APP_HOME .
EXPOSE 8080
ENTRYPOINT exec java -jar $APP_HOME/build/libs/$JAR_NAME