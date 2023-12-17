package com.aleh1s.backend.image;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@Table(name = "image")
@NoArgsConstructor
public class ImageEntity {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "extension", nullable = false)
    private String extension;

    @Lob
    @Column(name = "data", nullable = false)
    private byte[] data;

    public ImageEntity(String extension, byte[] data) {
        this.extension = extension;
        this.data = data;
    }

    @PrePersist
    private void prePersist() {
        this.id = UUID.randomUUID().toString();
    }
}
