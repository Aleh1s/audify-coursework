package com.aleh1s.backend.dto;

import com.aleh1s.backend.playlist.*;
import com.aleh1s.backend.registration.RegistrationRequest;
import com.aleh1s.backend.song.*;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRole;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {
    public UserEntity toUser(RegistrationRequest registrationRequest) {
        return new UserEntity(
                registrationRequest.firstName(),
                registrationRequest.lastName(),
                registrationRequest.email(),
                registrationRequest.password(),
                UserRole.USER
        );
    }

    public SongEntity toSong(CreateSongRequest createSongRequest) {
        return new SongEntity(
                createSongRequest.name(),
                createSongRequest.artist(),
                MusicCategory.getCategoryById(createSongRequest.categoryId()),
                createSongRequest.tags(),
                createSongRequest.text()
        );
    }

    public SongMinView toSongMinView(SongEntity songEntity) {
        return new SongMinView(
                songEntity.getId(),
                songEntity.getName(),
                songEntity.getArtist(),
                toMusicCategoryView(songEntity.getCategory()),
                songEntity.getPreviewId(),
                songEntity.getDurationInSeconds()
        );
    }

    public MusicCategoryView toMusicCategoryView(MusicCategory musicCategory) {
        return new MusicCategoryView(
                musicCategory.getId(),
                musicCategory.getCategoryName()
        );
    }

    public SongFullView toSongFullView(SongEntity songEntity) {
        return new SongFullView(
                songEntity.getId(),
                songEntity.getName(),
                songEntity.getArtist(),
                toMusicCategoryView(songEntity.getCategory()),
                songEntity.getTags(),
                songEntity.getText(),
                songEntity.getPreviewId(),
                songEntity.getAudioId(),
                songEntity.getDurationInSeconds()
        );
    }

    public PlaylistEntity toPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        return new PlaylistEntity(createPlaylistRequest.name());
    }

    public PlaylistFullView toPlaylistFullView(PlaylistEntity playlist) {
        return new PlaylistFullView(
                playlist.getId(),
                playlist.getName(),
                playlist.getTotalSongs(),
                playlist.getTotalDurationInSeconds(),
                playlist.isLikedSongsPlaylist(),
                playlist.getPreviewId()
        );
    }

    public PlaylistMinView toPlaylistMinView(PlaylistEntity playlist) {
        return new PlaylistMinView(
                playlist.getId(),
                playlist.getName(),
                playlist.getTotalSongs(),
                playlist.isLikedSongsPlaylist(),
                playlist.getPreviewId()
        );
    }

    public PlaylistRelatedSongView toPlaylistRelatedSongView(PlaylistEntity playlist) {
        return new PlaylistRelatedSongView(
                playlist.getId(),
                playlist.getName(),
                playlist.getPreviewId(),
                playlist.getTotalSongs(),
                playlist.isLikedSongsPlaylist(),
                playlist.isContainRelatedSong()
        );
    }
}