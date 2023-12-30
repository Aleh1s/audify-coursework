package com.aleh1s.backend.playlist;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CustomSongRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void removeSongFromPlaylistsBySongId(String songId) {
        entityManager.createNativeQuery("delete from song where song_id = :songId")
                .setParameter("songId", songId)
                .executeUpdate();
    }

}
