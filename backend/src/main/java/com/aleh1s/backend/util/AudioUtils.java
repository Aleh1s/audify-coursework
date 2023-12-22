package com.aleh1s.backend.util;

import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

public class AudioUtils {
    public static long getAudioDurationInSeconds(MultipartFile audio)
            throws IOException, InvalidDataException, UnsupportedTagException {
        File tempFile = null;
        try {
            tempFile = File.createTempFile(UUID.randomUUID().toString(), ".mp3");

            Files.copy(
                    audio.getInputStream(),
                    tempFile.toPath(),
                    StandardCopyOption.REPLACE_EXISTING
            );

            return new Mp3File(tempFile).getLengthInSeconds();
        } finally {
            if (Objects.nonNull(tempFile) && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}
