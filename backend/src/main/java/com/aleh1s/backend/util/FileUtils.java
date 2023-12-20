package com.aleh1s.backend.util;

import java.util.Objects;
import java.util.Optional;

public class FileUtils {
    public static Optional<String> getFileExtension(String fileName) {
        if (Objects.isNull(fileName)) {
            return Optional.empty();
        }

        int index = fileName.lastIndexOf(".");
        if (index == -1) {
            return Optional.empty();
        }

        return Optional.of(fileName.substring(index + 1));
    }
}
