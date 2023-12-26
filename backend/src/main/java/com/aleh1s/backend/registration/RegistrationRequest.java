package com.aleh1s.backend.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record RegistrationRequest(
        @NotNull(message = "Name cannot be null")
        @Length(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
        String name,
        @NotNull(message = "Email cannot be null")
        @Email(message = "Email should be valid")
        String email,
        @NotNull(message = "Password cannot be null")
        @Length(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        String password
) {
}
