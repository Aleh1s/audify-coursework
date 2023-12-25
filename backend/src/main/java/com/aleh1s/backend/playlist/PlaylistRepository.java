package com.aleh1s.backend.playlist;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PlaylistRepository extends JpaRepository<PlaylistEntity, Long> {

    @EntityGraph(attributePaths = {"songs"})
    Set<PlaylistEntity> findPlaylistByOwnerId(Long id);
}
