package com.aleh1s.backend.image;

import com.aleh1s.backend.exception.InvalidResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Set;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageService {

    @Value("#{'${media.image.supported-extensions}'.split(',')}")
    private Set<String> supportedImageExtensions;

    private final ImageRepository imageRepository;

    @Transactional
    public String uploadImage(MultipartFile image) throws IOException {
        String contentType = image.getContentType();
        if (isNull(contentType)) {
            throw new InvalidResourceException("Content type is not present");
        }

        if (!isContentTypeSupported(contentType)) {
            throw new InvalidResourceException("Content type is not supported");
        }

        String originalFilename = image.getOriginalFilename();
        if (isNull(originalFilename)) {
            throw new InvalidResourceException("File name is not present");
        }

        int index = originalFilename.lastIndexOf(".");
        if (index == -1) {
            throw new InvalidResourceException("File name have no extension");
        }

        String fileExtension = originalFilename.substring(index + 1);
        if (!supportedImageExtensions.contains(fileExtension)) {
            throw new InvalidResourceException("File extension is not supported. It should be one of: %s".formatted(supportedImageExtensions));
        }

        BufferedImage bufferedImage = ImageIO.read(image.getInputStream());

        int height = bufferedImage.getHeight();
        int width = bufferedImage.getWidth();

        if (height != 500 || width != 500) {
            throw new InvalidResourceException("Image should have 500x500 resolution");
        }

        ImageEntity newImage = new ImageEntity(fileExtension, image.getBytes());
        imageRepository.save(newImage);

        return newImage.getId();
    }

    public ImageEntity downloadImage(String id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image with id %s does not exist".formatted(id)));
    }

    private boolean isContentTypeSupported(String contentType) {
        return supportedImageExtensions.stream()
                .anyMatch(supportedImageExtension -> contentType.equals("image/%s".formatted(supportedImageExtension)));
    }
}
