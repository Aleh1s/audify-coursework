package com.aleh1s.backend.song;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.HitsMetadata;
import com.aleh1s.backend.audio.AudioService;
import com.aleh1s.backend.exception.InvalidResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.image.ImageService;
import com.aleh1s.backend.util.AudioUtils;
import com.aleh1s.backend.util.PaginationUtils;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.UnsupportedTagException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.CrossFields;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SongService {

    private static final Logger log = LoggerFactory.getLogger(SongService.class);

    private final SongRepository songRepository;
    private final ImageService imageService;
    private final AudioService audioService;
    private final ElasticsearchClient elasticsearchClient;

    @Transactional
    public void saveSong(SongEntity song, MultipartFile preview, MultipartFile audio)
            throws IOException {
        try {
            String previewId = imageService.saveImage(preview);
            String soundtrackId = audioService.saveAudio(audio);
            song.setId(UUID.randomUUID().toString());
            song.setPreviewId(previewId);
            song.setAudioId(soundtrackId);
            song.setDurationInSeconds(AudioUtils.getAudioDurationInSeconds(audio));
            songRepository.save(song);
        } catch (UnsupportedTagException | InvalidDataException e) {
            log.error(e.getMessage(), e);
            throw new InvalidResourceException("Invalid audio file");
        }
    }

    public Page<SongEntity> getSongsByCategory(MusicCategory category, PageRequest pageRequest) {
        return songRepository.findSongEntitiesByCategory(category, pageRequest);
    }

    public SongEntity getSongById(String songId) {
        return songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id %s not found".formatted(songId)));
    }

    public Page<SongEntity> findSongsByQuery(SongsSearchRequest request) throws IOException {
        List<String> fields = List.of("name", "artist", "text", "tags");
        PageRequest pageRequest = PaginationUtils.getPageRequest(request.offset(), request.limit());
        int from = pageRequest.getPageNumber() * pageRequest.getPageSize(), size = pageRequest.getPageSize();

        BoolQuery.Builder boolQueryBuilder = QueryBuilders.bool();
        if (nonNull(request.query())) {
            if (request.query().isBlank()) {
                boolQueryBuilder.must(bm -> bm.matchAll(mab -> mab
                        .boost(1.0f)
                ));
            } else {
                boolQueryBuilder.must(bm -> bm.multiMatch(mmb -> mmb
                        .query(request.query())
                        .type(CrossFields)
                        .fields(fields)
                ));
            }
        }

        if (nonNull(request.categoryId())) {
            MusicCategory category = MusicCategory.getCategoryById(request.categoryId());
            boolQueryBuilder.filter(bf -> bf.term(bt -> bt
                    .field("category")
                    .value(category.name())
            ));
        }

        SearchRequest searchRequest = SearchRequest.of(builder -> builder
                .query(b -> b.bool(boolQueryBuilder.build()))
                .from(from)
                .size(size)
        );

        SearchResponse<SongEntity> response = elasticsearchClient.search(searchRequest, SongEntity.class);

        HitsMetadata<SongEntity> hits = response.hits();
        if (isNull(hits.total())) {
            log.error("Total hits is null");
            return Page.empty();
        }

        long totalSongs = hits.total().value();
        List<SongEntity> songs = hits.hits().stream()
                .map(Hit::source)
                .toList();

        return new PageImpl<>(songs, pageRequest, totalSongs);
    }
}
