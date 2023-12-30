package com.aleh1s.backend.playlist;

import com.aleh1s.backend.song.SongEntity;
import com.aleh1s.backend.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "playlist")
@EqualsAndHashCode(of = "id")
public class PlaylistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "preview_id")
    private String previewId;

    @Setter(AccessLevel.PRIVATE)
    @ElementCollection
    @CollectionTable(
            name = "song",
            joinColumns = @JoinColumn(name = "playlist_id")
    )
    @Column(name = "song_id")
    private List<String> songs = new ArrayList<>();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserEntity owner;

    @Column(name = "is_liked_songs_playlist", nullable = false)
    private boolean isLikedSongsPlaylist;

    @Transient
    private int totalSongs;

    @Transient
    private Set<SongEntity> songEntities;

    @Transient
    private long totalDurationInSeconds;

    @Transient
    private boolean isContainRelatedSong;

    public PlaylistEntity(String name) {
        this.name = name;
    }

    public PlaylistEntity(String name, boolean isLikedSongsPlaylist) {
        this.name = name;
        this.isLikedSongsPlaylist = isLikedSongsPlaylist;
    }

    public boolean addSong(String songId) {
        boolean isExist = songs.stream().anyMatch(songId::equals);

        if (isExist) {
            return false;
        }

        return songs.add(songId);
    }

    public boolean deleteSong(String songId) {
        return songs.remove(songId);
    }
}
