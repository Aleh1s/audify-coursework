package com.aleh1s.backend.util;

import com.aleh1s.backend.registration.RegistrationRequest;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRole;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {
    public UserEntity toUser(RegistrationRequest registrationRequest) {
        return new UserEntity(
                registrationRequest.firstName(),
                registrationRequest.lastName(),
                registrationRequest.email(),
                registrationRequest.password(),
                UserRole.USER
        );
    }
}