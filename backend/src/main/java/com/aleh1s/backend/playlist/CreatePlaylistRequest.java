package com.aleh1s.backend.playlist;


import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record CreatePlaylistRequest(
        @NotNull(message = "name cannot be null")
        @Length(min = 2, max = 255, message = "name must be between 2 and 255 characters")
        String name
) {
}
