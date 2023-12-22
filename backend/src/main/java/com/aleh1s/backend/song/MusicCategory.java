package com.aleh1s.backend.song;

import com.aleh1s.backend.exception.ResourceNotFoundException;
import lombok.Getter;

@Getter
public enum MusicCategory {
    POP_MUSIC(1, "Pop music"),
    HIP_HOP_MUSIC(2, "Hip hop music"),
    ROCK_MUSIC(3, "Rock music"),
    RHYTHM_AND_BLUES(4, "Rhythm and blues"),
    SOUL_MUSIC(5, "Soul music"),
    REGGAE(6, "Reggae"),
    COUNTRY(7, "Country"),
    FUNK(8, "Funk"),
    FOLK_MUSIC(9, "Folk music"),
    MIDDLE_EASTERN_MUSIC(10, "Middle Eastern music"),
    JAZZ(11, "Jazz"),
    DISCO(12, "Disco"),
    CLASSICAL_MUSIC(13, "Classical music"),
    ELECTRONIC_MUSIC(14, "Electronic music"),
    MUSIC_OF_LATIN_AMERICA(15, "Music of Latin America"),
    BLUES(16, "Blues"),
    MUSIC_FOR_CHILDREN(17, "Music for children"),
    NEWAGE_MUSIC(18, "New-age music"),
    VOCAL_MUSIC(19, "Vocal music"),
    MUSIC_OF_AFRICA(20, "Music of Africa"),
    CHRISTIAN_MUSIC(21, "Christian music"),
    MUSIC_OF_ASIA(22, "Music of Asia"),
    SKA(23, "Ska"),
    TRADITIONAL_MUSIC(24, "Traditional music"),
    INDEPENDENT_MUSIC(25, "Independent music");

    private final int id;
    private final String categoryName;

    MusicCategory(int id, String categoryName) {
        this.id = id;
        this.categoryName = categoryName;
    }

    public static MusicCategory getCategoryById(int id) {
        for (MusicCategory category : values()) {
            if (category.id == id) {
                return category;
            }
        }
        throw new ResourceNotFoundException("No category with id %d".formatted(id));
    }
}
