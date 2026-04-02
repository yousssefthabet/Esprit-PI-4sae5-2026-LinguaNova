# --- build stage ---
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace
COPY . .
RUN chmod +x mvnw || true
RUN ./mvnw -q -DskipTests package

# --- runtime stage ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java","-jar","/app/app.jar"]

