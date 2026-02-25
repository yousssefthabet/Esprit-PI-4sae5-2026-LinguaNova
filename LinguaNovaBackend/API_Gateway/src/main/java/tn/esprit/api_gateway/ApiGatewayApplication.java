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
                        .uri("lb://LINGUANOVA"))

                .route("question-service", r -> r
                        .path("/api/questions/**")
                        .uri("lb://LINGUANOVA"))

                .route("reponse-service", r -> r
                        .path("/api/reponses/**")
                        .uri("lb://LINGUANOVA"))

                .route("student-answer-service", r -> r
                        .path("/api/student-answers/**")
                        .uri("lb://LINGUANOVA"))

                .route("student-exam-service", r -> r
                        .path("/api/student-exams/**")
                        .uri("lb://LINGUANOVA"))

                .route("student-profile-service", r -> r
                        .path("/api/student-profiles/**")
                        .uri("lb://LINGUANOVA"))

                .build();
    }
}
