package com.aleh1s.backend.song;

public record SongsSearchRequest(
        String query,
        Integer categoryId,
        int offset,
        int limit
) {
}
