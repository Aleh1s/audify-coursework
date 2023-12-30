package com.aleh1s.backend.song;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.AggregationBuilders;
import co.elastic.clients.elasticsearch._types.aggregations.SumAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.SumAggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.IdsQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.HitsMetadata;
import com.aleh1s.backend.audio.AudioService;
import com.aleh1s.backend.exception.InvalidResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.image.ImageService;
import com.aleh1s.backend.playlist.PlaylistEntity;
import com.aleh1s.backend.playlist.PlaylistService;
import com.aleh1s.backend.util.AudioUtils;
import com.aleh1s.backend.util.PaginationUtils;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.UnsupportedTagException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

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

    private PlaylistService playlistService;

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
        SongEntity song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id %s not found".formatted(songId)));

        PlaylistEntity likedSongsPlaylist = playlistService.getLikedSongsPlaylist();
        if (likedSongsPlaylist.getSongs().contains(song.getId())) {
            song.setLiked(true);
        }

        return song;
    }

    public Page<SongEntity> findSongsByQuery(SongsSearchRequest request) throws IOException {
        List<String> fields = List.of("name", "artist", "text", "tags");
        PageRequest pageRequest = PaginationUtils.getPageRequest(request.page(), request.limit());
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

    public Page<SongEntity> getSongsByIds(List<String> songsIds, PageRequest pageRequest) throws IOException {
        IdsQuery idsQuery = QueryBuilders.ids()
                .values(new ArrayList<>(songsIds))
                .build();

        SearchRequest searchRequest = SearchRequest.of(srb -> srb
                .query(qb -> qb.ids(idsQuery))
                .from(pageRequest.getPageNumber() * pageRequest.getPageSize())
                .size(pageRequest.getPageSize())
        );

        SearchResponse<SongEntity> response = elasticsearchClient.search(searchRequest, SongEntity.class);

        HitsMetadata<SongEntity> hits = response.hits();
        if (isNull(hits.total())) {
            log.error("Total hits is null");
            return Page.empty();
        }

        long totalSongs = hits.total().value();
        List<SongEntity> songs = new ArrayList<>(hits.hits().stream()
                .map(Hit::source)
                .toList());

        songs.sort(Comparator.comparingInt(song -> songsIds.indexOf(song.getId())));

        return new PageImpl<>(songs, pageRequest, totalSongs);
    }

    public boolean isSongExistsById(String songId) {
        return songRepository.existsById(songId);
    }

    public long getTotalDurationInSecondsByIds(Collection<String> songsIds) throws IOException {
        IdsQuery idsQuery = QueryBuilders.ids()
                .values(new ArrayList<>(songsIds))
                .build();

        SumAggregation aggregation = AggregationBuilders.sum()
                .field("durationInSeconds")
                .build();

        SearchRequest searchRequest = SearchRequest.of(srb -> srb
                .query(qb -> qb.ids(idsQuery))
                .aggregations("total_duration", a -> a.sum(aggregation))
                .size(0)
        );

        SearchResponse<SongEntity> response = elasticsearchClient.search(searchRequest, SongEntity.class);
        SumAggregate totalDuration = response.aggregations()
                .get("total_duration")
                .sum();

        return (long) totalDuration.value();
    }

    public Page<SongEntity> getSongsByPlaylistId(Long playlistId, PageRequest pageRequest) throws IOException {
        PlaylistEntity playlist = playlistService.getPlaylistById(playlistId);

        List<String> songsIds = playlist.getSongs().stream()
                .skip(pageRequest.getOffset() * pageRequest.getPageSize())
                .limit(pageRequest.getPageSize())
                .toList();

        return getSongsByIds(songsIds, pageRequest);
    }

    @Autowired
    public void setPlaylistService(@Lazy PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @Transactional
    public void deleteSongById(String songId) {
        SongEntity songToDelete = getSongById(songId);

        String previewId = songToDelete.getPreviewId();
        imageService.deleteImageById(previewId);

        String audioId = songToDelete.getAudioId();
        audioService.deleteAudioById(audioId);

        playlistService.removeSongFromPlaylistsBySongId(songId);
        songRepository.deleteById(songId);
    }

    public SongEntity getNextSong(String currentSongId, Long relatedSongPlaylistId) {
        PlaylistEntity playlist;
        List<String> songs;

        if (nonNull(relatedSongPlaylistId)) {
            playlist = playlistService.getPlaylistById(relatedSongPlaylistId);
            songs = playlist.getSongs();

            int index = songs.indexOf(currentSongId);
            if (index == -1) {
                throw new ResourceNotFoundException("Song with id %s not found in playlist with id %d".formatted(currentSongId, relatedSongPlaylistId));
            }

            if (index == songs.size() - 1) {
                return getSongById(songs.getFirst());
            }

            return getSongById(songs.get(index + 1));
        }

        playlist = playlistService.getLikedSongsPlaylist();
        songs = playlist.getSongs();

        if (songs.isEmpty()) {
            return getSongById(currentSongId);
        }

        return getSongById(songs.getFirst());
    }

    public SongEntity getPreviousSong(String currentSongId, Long relatedSongPlaylistId) {
        PlaylistEntity playlist;
        List<String> songs;

        if (nonNull(relatedSongPlaylistId)) {
            playlist = playlistService.getPlaylistById(relatedSongPlaylistId);
            songs = playlist.getSongs();

            int index = songs.indexOf(currentSongId);
            if (index == -1) {
                throw new ResourceNotFoundException("Song with id %s not found in playlist with id %d".formatted(currentSongId, relatedSongPlaylistId));
            }

            if (index == 0) {
                return getSongById(currentSongId);
            }

            return getSongById(songs.get(index - 1));
        }

        playlist = playlistService.getLikedSongsPlaylist();
        songs = playlist.getSongs();

        if (songs.isEmpty()) {
            return getSongById(currentSongId);
        }

        return getSongById(songs.getFirst());
    }
}
