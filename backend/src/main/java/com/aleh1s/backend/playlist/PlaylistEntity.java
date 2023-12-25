package com.aleh1s.backend.playlist;

import com.aleh1s.backend.song.SongEntity;
import com.aleh1s.backend.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
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

    @Column(name = "preview_id", nullable = false)
    private String previewId;

    @Setter(AccessLevel.PRIVATE)
    @ElementCollection
    @CollectionTable(
            name = "song",
            joinColumns = @JoinColumn(name = "playlist_id")
    )
    @Column(name = "song_id")
    private Set<String> songs = new HashSet<>();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserEntity owner;

    @Column(name = "total_songs", nullable = false)
    private int totalSongs;

    @Transient
    private Set<SongEntity> songEntities;

    @Transient
    private long totalDurationInSeconds;

    public PlaylistEntity(String name) {
        this.name = name;
    }

    public boolean addSong(String songId) {
        boolean isAdded = songs.add(songId);
        if (isAdded) {
            totalSongs++;
        }
        return isAdded;
    }

    public boolean deleteSong(String songId) {
        boolean isRemoved = songs.remove(songId);
        if (isRemoved) {
            totalSongs--;
        }
        return isRemoved;
    }
}
