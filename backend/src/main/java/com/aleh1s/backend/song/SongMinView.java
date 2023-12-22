package com.aleh1s.backend.song;

public record SongMinView(
        String id,
        String name,
        String artist,
        MusicCategoryView category,
        String previewId,
        long durationInSeconds
) {
}
