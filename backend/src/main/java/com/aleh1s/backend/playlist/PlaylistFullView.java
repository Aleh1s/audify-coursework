package com.aleh1s.backend.playlist;

public record PlaylistFullView(
        Long id,
        String name,
        int totalSongs,
        long totalDurationInSeconds,
        boolean isLikedSongsPlaylist,
        String previewId
) {
}
