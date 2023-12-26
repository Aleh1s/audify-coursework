package com.aleh1s.backend.audio;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/audios")
public class AudioController {

    private final AudioService audioService;

    @GetMapping("/{id}")
    public ResponseEntity<?> streamAudio(@PathVariable("id") String id, @RequestHeader(name = "range", required = false) String rangeStr) {
        return audioService.streamAudio(id, AudioRange.parse(rangeStr));
    }
}
