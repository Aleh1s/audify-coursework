package com.aleh1s.backend.audio;

import com.aleh1s.backend.exception.InvalidResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.util.ArrayUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AudioService {

    @Value("#{'${media.audio.supported-extensions}'.split(',')}")
    private Set<String> supportedAudioExtensions;

    private final AudioRepository audioRepository;

    @Transactional
    public String saveAudio(MultipartFile audio) throws IOException {
        String originalFilename = audio.getOriginalFilename();

        if (isNull(originalFilename)) {
            throw new InvalidResourceException("File name is null");
        }

        int index = originalFilename.indexOf('.');
        if (index == -1) {
            throw new InvalidResourceException("File name have no extension");
        }
        
        String fileExtension = originalFilename.substring(index + 1);
        if (!supportedAudioExtensions.contains(fileExtension)) {
            throw new InvalidResourceException("File extension is not supported. It should be one of: %s".formatted(supportedAudioExtensions));
        }

        AudioEntity newAudio = new AudioEntity(fileExtension, audio.getSize(), audio.getBytes());
        audioRepository.save(newAudio);

        return newAudio.getId();
    }

    public ResponseEntity<?> streamAudio(String id, AudioRange audioRange) {
        AudioEntity audio = getAudioById(id);

        byte[] data = audio.getData();
        if (isNull(audioRange)) {
            return ResponseEntity.status(HttpStatus.OK)
                    .header("Content-Type", "audio/mpeg")
                    .header("Content-Length", String.valueOf(data.length))
                    .body(data);
        }

        long rangeStart = audioRange.getStart();
        Long rangeEnd = audioRange.getEnd();

        if (isNull(rangeEnd) || data.length < rangeEnd) {
            rangeEnd = (long) data.length - 1;
        }

        data = ArrayUtils.readByteRange(data, rangeStart, rangeEnd);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .header("Content-Type", "audio/mpeg")
                .header("Accept-Ranges", "bytes")
                .header("Content-Length", String.valueOf(data.length))
                .header("Content-Range", "bytes %d-%d/%d".formatted(rangeStart, rangeEnd, audio.getLength()))
                .body(data);
    }

    public AudioEntity getAudioById(String id) {
        return audioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media with id %s does not exist".formatted(id)));
    }
}
