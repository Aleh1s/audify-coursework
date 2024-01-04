package com.aleh1s.backend.song;

import com.aleh1s.backend.constant.Indices;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Document(indexName = Indices.SONG_INDEX)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SongEntity {

    @Id
    @Field(type = FieldType.Keyword)
    private String id;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String artist;

    @Field(type = FieldType.Keyword)
    private MusicCategory category;

    @Field(type = FieldType.Text)
    private List<String> tags;

    @Field(type = FieldType.Text)
    private String text;

    @Field(type = FieldType.Long)
    private long durationInSeconds;

    @Field(type = FieldType.Keyword)
    private String previewId;

    @Field(type = FieldType.Keyword)
    private String audioId;

    @Transient
    private boolean isLiked;

    public SongEntity(
            String name,
            String artist,
            MusicCategory category,
            List<String> tags,
            String text
    ) {
        this.name = name;
        this.artist = artist;
        this.category = category;
        this.tags = tags;
        this.text = text;
    }
}
