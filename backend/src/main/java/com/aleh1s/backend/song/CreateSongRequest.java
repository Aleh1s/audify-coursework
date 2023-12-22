package com.aleh1s.backend.song;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

public record CreateSongRequest(
        @NotNull(message = "Name cannot be null")
        @Length(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,
        @NotNull(message = "Artist cannot be null")
        @Length(min = 2, max = 50, message = "Artist must be between 2 and 50 characters")
        String artist,
        @NotNull(message = "Category cannot be null")
        Integer categoryId,
        @Size(max = 20, message = "Tags must be less than 10")
        List<String> tags,
        @Length(max = 100_000, message = "Text must be less than 100000 characters")
        String text
) {
}
