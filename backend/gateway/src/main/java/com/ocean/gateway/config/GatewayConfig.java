package com.ocean.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r.path("/api/users/**")
                    .uri("lb://user-service"))
            .route("farm-service", r -> r.path("/api/farms/**")
                    .uri("lb://farm-service"))
            .route("device-service", r -> r.path("/api/devices/**")
                    .uri("lb://device-service"))
            .route("alarm-service", r -> r.path("/api/alarms/**")
                    .uri("lb://alarm-service"))
            .build();
    }
}
