package com.aleh1s.backend.song;

public record SongsSearchRequest(
        String query,
        Integer categoryId,
        int page,
        int limit
) {
}
