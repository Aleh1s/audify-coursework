package com.aleh1s.backend.playlist;

import com.aleh1s.backend.dto.DtoMapper;
import com.aleh1s.backend.song.SongMinView;
import com.aleh1s.backend.song.SongService;
import com.aleh1s.backend.util.PaginationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final DtoMapper dtoMapper;
    private final SongService songService;

    @GetMapping
    public ResponseEntity<?> getPlaylists(
            @RequestParam(value = "related_song", required = false) String relatedSongId
    ) {
        Set<PlaylistEntity> playlists = playlistService.getPlaylists(relatedSongId);
        Function<PlaylistEntity, ?> mapper = isNull(relatedSongId)
                ? dtoMapper::toPlaylistMinView
                : dtoMapper::toPlaylistRelatedSongView;
        List<?> body = playlists.stream()
                .map(mapper)
                .toList();
        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<?> createPlaylist(
            @Valid @RequestPart("playlist") CreatePlaylistRequest createPlaylistRequest,
            @RequestPart("preview") MultipartFile preview
    ) throws IOException {
        PlaylistEntity playlist = dtoMapper.toPlaylist(createPlaylistRequest);
        playlistService.savePlaylist(playlist, preview);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlaylist(@PathVariable("id") Long id) {
        playlistService.deletePlaylistById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlaylist(
            @PathVariable("id") Long id,
            @Valid @RequestPart("playlist") CreatePlaylistRequest request,
            @RequestPart(name = "preview", required = false) MultipartFile preview
    ) throws IOException {
        playlistService.updatePlaylist(id, dtoMapper.toPlaylist(request), preview);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlaylistById(@PathVariable("id") Long id) throws IOException {
        PlaylistEntity playlist = playlistService.getPlaylistByIdFetchTotalDurationInSeconds(id);
        return ResponseEntity.ok(dtoMapper.toPlaylistFullView(playlist));
    }

    @GetMapping("/{id}/songs")
    public ResponseEntity<?> getSongsByPlaylistId(
            @PathVariable("id") Long id,
            @RequestParam(value = "limit", defaultValue = "10") int limit,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) throws IOException {
        Page<SongMinView> songs = songService.getSongsByPlaylistId(
                id, PaginationUtils.getPageRequest(page, limit)
        ).map(dtoMapper::toSongMinView);
        return ResponseEntity.ok(songs);
    }

    @PostMapping("/{playlist-id}/songs/{song-id}")
    public ResponseEntity<?> addSongToPlaylist(
            @PathVariable("playlist-id") Long playlistId,
            @PathVariable("song-id") String songId
    ) {
        playlistService.addSongToPlaylist(playlistId, songId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{playlist-id}/songs/{song-id}")
    public ResponseEntity<?> deleteSongFromPlaylist(
            @PathVariable("playlist-id") Long playlistId,
            @PathVariable("song-id") String songId
    ) {
        playlistService.deleteSongFromPlaylist(playlistId, songId);
        return ResponseEntity.ok().build();
    }
}