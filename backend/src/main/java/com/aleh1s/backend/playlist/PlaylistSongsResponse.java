package com.aleh1s.backend.playlist;

import org.springframework.data.domain.Page;

public record PlaylistSongsResponse(
        Page<?> songs,
        long totalDuration,
        int totalSongs
) {
}
