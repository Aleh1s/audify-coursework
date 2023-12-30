package com.aleh1s.backend.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record ChangeNameRequest(
        @NotNull(message = "Name cannot be null")
        @Length(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
        String name
) {
}
