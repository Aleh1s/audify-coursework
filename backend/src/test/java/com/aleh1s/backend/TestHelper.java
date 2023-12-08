package com.aleh1s.backend;

import com.aleh1s.backend.registration.RegistrationRequest;
import com.aleh1s.backend.user.AuthProvider;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRole;
import com.github.javafaker.Faker;

public class TestHelper {

    private static final Faker FAKER = new Faker();

    public static UserEntity newUserEntity() {
        return new UserEntity(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                FAKER.internet().emailAddress(),
                FAKER.internet().password(),
                UserRole.USER,
                AuthProvider.INTERNAL
        );
    }

    public static RegistrationRequest newRegistrationRequest() {
        return new RegistrationRequest(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                FAKER.internet().emailAddress(),
                FAKER.internet().password()
        );
    }

}
