package com.aleh1s.backend.audio;

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
@Table(name = "audio")
@NoArgsConstructor
public class AudioEntity {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "extension", nullable = false)
    private String extension;

    @Column(name = "length", nullable = false)
    private long length;

    @Lob
    @Column(name = "data", nullable = false)
    private byte[] data;

    public AudioEntity(String extension, long length, byte[] data) {
        this.extension = extension;
        this.length = length;
        this.data = data;
    }

    @PrePersist
    private void prePersist() {
        this.id = UUID.randomUUID().toString();
    }
}
