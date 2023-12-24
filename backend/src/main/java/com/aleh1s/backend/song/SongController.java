package com.aleh1s.backend.song;

import com.aleh1s.backend.dto.DtoMapper;
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
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/songs")
public class SongController {

    private final SongService songService;
    private final DtoMapper dtoMapper;

    @PostMapping
    public ResponseEntity<?> addSong(
            @Valid @RequestPart("song") CreateSongRequest createSongRequest,
            @RequestPart("preview") MultipartFile preview,
            @RequestPart("audio") MultipartFile audio
    ) throws IOException {
        SongEntity song = dtoMapper.toSong(createSongRequest);
        songService.saveSong(song, preview, audio);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{song-id}")
    public ResponseEntity<?> getSongById(@PathVariable("song-id") String songId) {
        SongEntity song = songService.getSongById(songId);
        SongFullView songFullView = dtoMapper.toSongFullView(song);
        return ResponseEntity.ok(songFullView);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<MusicCategoryView> categories = Stream.of(MusicCategory.values())
                .map(dtoMapper::toMusicCategoryView)
                .toList();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{category-id}")
    public ResponseEntity<?> getSongsByCategory(
            @PathVariable("category-id") int categoryId,
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "limit", required = false, defaultValue = "10") int limit
    ) {
        Page<SongMinView> songs = songService.getSongsByCategory(
                MusicCategory.getCategoryById(categoryId),
                PaginationUtils.getPageRequest(page, limit)
        ).map(dtoMapper::toSongMinView);
        return ResponseEntity.ok(songs);
    }

    @PostMapping("/search")
    public ResponseEntity<?> findSongsByQuery(@Valid @RequestBody SongsSearchRequest query) throws IOException {
        Page<SongMinView> songs = songService.findSongsByQuery(query)
                .map(dtoMapper::toSongMinView);
        return ResponseEntity.ok(songs);
    }
}
