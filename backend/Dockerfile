# Step 1: Build the Spring Boot application using Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies for layer caching
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Runtime image (lightweight Alpine JRE 21)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Optimize JVM for low-memory cloud instances (e.g. AWS t2.micro / t3.micro with 1GB RAM)
ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
