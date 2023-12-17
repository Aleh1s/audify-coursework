package com.aleh1s.backend.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record RegistrationRequest(
        @NotNull(message = "First name cannot be null")
        @Length(min = 2, max = 255, message = "First name must be between 2 and 255 characters")
        String firstName,
        @NotNull(message = "Last name cannot be null")
        @Length(min = 2, max = 255, message = "Last name must be between 2 and 255 characters")
        String lastName,
        @NotNull(message = "Email cannot be null")
        @Email(message = "Email should be valid")
        String email,
        @NotNull(message = "Password cannot be null")
        @Length(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        String password
) {
}
