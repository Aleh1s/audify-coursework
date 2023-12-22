package com.aleh1s.backend.song;

import java.util.List;

public record SongFullView(
        String id,
        String name,
        String artist,
        MusicCategoryView category,
        List<String> tags,
        String text,
        String previewId,
        String audioId,
        long durationInSeconds
) {
}
