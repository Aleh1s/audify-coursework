package com.aleh1s.backend.playlist;

public record PlaylistMinView(
        Long id,
        String name,
        int totalSongs,
        String previewId
) {
}
