package com.aleh1s.backend.dto;

import com.aleh1s.backend.playlist.*;
import com.aleh1s.backend.registration.RegistrationRequest;
import com.aleh1s.backend.song.*;
import com.aleh1s.backend.user.UserDto;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {

    public UserDto toUserDto(UserEntity userEntity) {
        return new UserDto(
                userEntity.getId(),
                userEntity.getName(),
                userEntity.getEmail(),
                userEntity.getAuthProvider(),
                userEntity.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList(),
                userEntity.getUsername(),
                userEntity.isBlocked()
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
                songEntity.getDurationInSeconds(),
                songEntity.isLiked()
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

    public UserEntity toUser(RegistrationRequest request) {
        return new UserEntity(
                request.name(),
                request.email(),
                request.password(),
                UserRole.USER
        );
    }
}