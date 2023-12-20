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

    @PostMapping
    public ResponseEntity<?> uploadAudio(@RequestParam("audio") MultipartFile audio) throws IOException {
        String id = audioService.saveAudio(audio);
        return ResponseEntity.created(URI.create("/api/v1/audios/%s".formatted(id)))
                .body(new UploadAudioResponse(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> streamAudio(@PathVariable("id") String id, @RequestHeader(name = "range", required = false) String rangeStr) {
        return audioService.streamAudio(id, AudioRange.parse(rangeStr));
    }
}
