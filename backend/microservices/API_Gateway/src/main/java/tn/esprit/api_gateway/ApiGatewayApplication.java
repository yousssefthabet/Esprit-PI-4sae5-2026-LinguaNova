package tn.esprit.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("exam-service", r -> r
                        .path("/api/exams/**")
                        .uri("lb://examen-service"))

                .route("question-service", r -> r
                        .path("/api/questions/**")
                        .uri("lb://examen-service"))

                .route("reponse-service", r -> r
                        .path("/api/reponses/**")
                        .uri("lb://examen-service"))

                .route("student-answer-service", r -> r
                        .path("/api/student-answers/**")
                        .uri("lb://examen-service"))

                .route("student-exam-service", r -> r
                        .path("/api/student-exams/**")
                        .uri("lb://examen-service"))

                .route("student-profile-service", r -> r
                        .path("/api/student-profiles/**")
                        .uri("lb://examen-service"))

                .route("quiz-service", r -> r
                        .path("/api/quiz/**")
                        .uri("lb://examen-service"))
                .route("certificate-service", r -> r
                        .path("/api/certificates/**")
                        .uri("lb://examen-service"))

                .route("note-service", r -> r
                        .path("/api/notes/**")
                        .uri("lb://note-service"))

                .route("cahier-service", r -> r
                        .path("/api/cahiers/**")
                        .uri("lb://note-service"))

                .route("event-service", r -> r
                        .path("/api/events/**")
                        .uri("lb://event-service"))

                .route("course-service", r -> r
                        .path("/api/courses/**")
                        .uri("lb://course-service"))


                .build();
    }
}
