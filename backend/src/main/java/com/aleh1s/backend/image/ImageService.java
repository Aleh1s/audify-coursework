package com.aleh1s.backend.image;

import com.aleh1s.backend.exception.InvalidResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.util.FileUtils;
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
    public String saveImage(MultipartFile image) throws IOException {
        String contentType = image.getContentType();
        if (isNull(contentType) || !contentType.startsWith("image")) {
            throw new InvalidResourceException("Content type is not present or is not image");
        }

        String originalFilename = image.getOriginalFilename();
        String fileExtension = FileUtils.getFileExtension(originalFilename)
                .orElseThrow(() -> new InvalidResourceException("File name have no extension"));

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

    public ImageEntity getImageById(String id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media with id %s does not exist".formatted(id)));
    }
}
