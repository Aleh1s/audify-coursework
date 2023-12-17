package com.aleh1s.backend.image;

import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    @InjectMocks
    private ImageService underTest;
    @Mock
    private ImageRepository imageRepository;

    private boolean isStarted = false;

    @BeforeEach
    void beforeAll() {
        if (!isStarted) {
            ReflectionTestUtils.setField(underTest, "supportedImageExtensions", Set.of("png", "jpg", "jpeg"));
            isStarted = true;
        }
    }

    @Test
    @SneakyThrows
    void uploadImage() {
        // given
        String fileName = "test_image.png", contentType = MediaType.IMAGE_PNG_VALUE;
        byte[] imageBytes = readImageBytes("images/500x500.png");
        MultipartFile file = new MockMultipartFile(fileName, fileName, contentType, imageBytes);
        ArgumentCaptor<ImageEntity> argumentCaptor = ArgumentCaptor.forClass(ImageEntity.class);
        // when
        underTest.uploadImage(file);
        // then
        verify(imageRepository, times(1)).save(argumentCaptor.capture());
        ImageEntity argumentCaptorValue = argumentCaptor.getValue();
        assertThat(argumentCaptorValue.getExtension()).isEqualTo("png");
        assertThat(argumentCaptorValue.getData()).isEqualTo(imageBytes);
    }

    @Test
    void downloadImage() {
        // given
        String id = UUID.randomUUID().toString();
        ImageEntity expected = new ImageEntity("png", new byte[]{1, 2, 3, 4, 5});
        given(imageRepository.findById(id)).willReturn(Optional.of(expected));
        // when
        ImageEntity actual = underTest.downloadImage(id);
        // then
        assertThat(actual).isEqualTo(expected);
    }

    @SneakyThrows
    private byte[] readImageBytes(String path) {
        return Files.readAllBytes(Path.of(Objects.requireNonNull(getClass().getClassLoader().getResource(path)).toURI()));
    }
}