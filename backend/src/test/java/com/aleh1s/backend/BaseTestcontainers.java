package com.aleh1s.backend;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers()
public abstract class BaseTestcontainers {

    @BeforeAll
    static void beforeAll() {
        Flyway.configure().dataSource(
                postgresDBContainer.getJdbcUrl(),
                postgresDBContainer.getUsername(),
                postgresDBContainer.getPassword()
        ).load().migrate();
    }

    @Container
    protected static final PostgreSQLContainer<?> postgresDBContainer
            = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("amigoscode_test_db")
            .withUsername("username")
            .withPassword("password");

    @DynamicPropertySource
    private static void registerDataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresDBContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresDBContainer::getUsername);
        registry.add("spring.datasource.password", postgresDBContainer::getPassword);
    }
}
