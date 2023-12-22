package com.aleh1s.backend.song;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends ElasticsearchRepository<SongEntity, String> {
    Page<SongEntity> findSongEntitiesByCategory(MusicCategory category, Pageable pageable);
}
