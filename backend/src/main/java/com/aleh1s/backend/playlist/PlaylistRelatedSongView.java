package com.aleh1s.backend.playlist;

public record PlaylistRelatedSongView(
        Long id,
        String name,
        String previewId,
        int totalSongs,
        boolean isLikedSongsPlaylist,
        boolean containsRelatedSong
) {
}
