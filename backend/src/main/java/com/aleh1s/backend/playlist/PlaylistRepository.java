package com.aleh1s.backend.playlist;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PlaylistRepository extends JpaRepository<PlaylistEntity, Long> {

    @EntityGraph(attributePaths = {"songs"})
    Set<PlaylistEntity> findPlaylistEntitiesByOwnerId(Long id);

    @EntityGraph(attributePaths = {"songs", "owner"})
    @Query("""
            select p
            from PlaylistEntity p
            where p.owner.id = :id
            and p.isLikedSongsPlaylist = true
            """)
    PlaylistEntity findLikedSongsPlaylistByOwnerIdFetchSongs(Long id);
}
