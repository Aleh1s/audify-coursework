package com.aleh1s.backend.image;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
        String id = imageService.saveImage(image);
        return ResponseEntity.created(URI.create("/api/v1/images/%s".formatted(id)))
                .body(new UploadImageResponse(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadImage(@PathVariable("id") String id) {
        ImageEntity imageEntity = imageService.getImageById(id);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/%s".formatted(imageEntity.getExtension())))
                .body(imageEntity.getData());
    }
}
