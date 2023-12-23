package com.aleh1s.backend.playlist;

import com.aleh1s.backend.dto.DtoMapper;
import com.aleh1s.backend.song.SongMinView;
import com.aleh1s.backend.song.SongService;
import com.aleh1s.backend.util.PaginationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final SongService songService;
    private final DtoMapper dtoMapper;

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
    public ResponseEntity<?> getPlaylistById(@PathVariable("id") Long id) {
        PlaylistEntity playlist = playlistService.getPlaylistById(id);
        return ResponseEntity.ok(dtoMapper.toPlaylistFullView(playlist));
    }

    @GetMapping("/{id}/songs")
    public ResponseEntity<?> getSongsByPlaylistId(
            @PathVariable("id") Long id,
            @RequestParam(value = "limit", defaultValue = "10") int limit,
            @RequestParam(value = "offset", defaultValue = "0") int offset
    ) throws IOException {
        PageRequest pageRequest = PaginationUtils.getPageRequest(offset, limit);
        PlaylistEntity playlist = playlistService.getPlaylistByIdFetchSongs(id, pageRequest);
        List<SongMinView> songs = playlist.getSongEntities().stream()
                .map(dtoMapper::toSongMinView)
                .toList();
        return ResponseEntity.ok(new PlaylistSongsResponse(
                new PageImpl<>(songs, pageRequest, playlist.getSongs().size()),
                playlist.getTotalDurationInSeconds(),
                playlist.getTotalSongs()
        ));
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