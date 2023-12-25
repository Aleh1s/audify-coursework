package com.aleh1s.backend.playlist;

import com.aleh1s.backend.exception.DuplicateResourceException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.image.ImageService;
import com.aleh1s.backend.song.SongService;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.Objects.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserService userService;
    private final ImageService imageService;
    private final SongService songService;

    @Transactional
    public void savePlaylist(PlaylistEntity playlist, MultipartFile preview) throws IOException {
        // dummy user
        UserEntity user = userService.getUserById(1L);
        requireUniquePlaylistName(playlist, user.getPlaylists());

        String previewId = imageService.saveImage(preview);
        playlist.setPreviewId(previewId);

        user.addPlaylist(playlist);
        playlistRepository.save(playlist);
    }

    public Set<PlaylistEntity> getPlaylists(String relatedSongId) {
        // dummy user
        UserEntity user = userService.getUserById(1L);

        if (nonNull(relatedSongId)) {
            Set<PlaylistEntity> playlists = playlistRepository.findPlaylistByOwnerId(user.getId());
            playlists.stream()
                    .filter(playlist -> playlist.getSongs().contains(relatedSongId))
                    .forEach(playlist -> playlist.setContainRelatedSong(true));
            return playlists;
        }

        Hibernate.initialize(user.getPlaylists());
        return user.getPlaylists();
    }

    public PlaylistEntity getPlaylistById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id %d not found".formatted(id)));
    }

    public PlaylistEntity getPlaylistByIdFetchTotalDurationInSeconds(Long id) throws IOException {
        PlaylistEntity playlist = getPlaylistById(id);
        long totalDurationInSeconds = songService.getTotalDurationInSecondsByIds(playlist.getSongs());
        playlist.setTotalDurationInSeconds(totalDurationInSeconds);
        return playlist;
    }

    private void requireUniquePlaylistName(PlaylistEntity newPlaylist, Set<PlaylistEntity> playlists) {
        boolean isPlaylistNameUnique = playlists.stream().noneMatch(playlist -> playlist.getName().equals(newPlaylist.getName()));
        if (!isPlaylistNameUnique) {
            throw new DuplicateResourceException("Playlist with name %s already exists".formatted(newPlaylist.getName()));
        }
    }

    @Transactional
    public void addSongToPlaylist(Long playlistId, String songId) {
        PlaylistEntity playlist = getPlaylistById(playlistId);
        boolean isSongExistById = songService.isSongExistsById(songId);
        if (!isSongExistById) {
            throw new ResourceNotFoundException("Song with id %s not found".formatted(songId));
        }
        boolean isSongAdded = playlist.addSong(songId);
        if (!isSongAdded) {
            throw new DuplicateResourceException("Song with id %s already exists in playlist".formatted(songId));
        }
    }

    @Transactional
    public void deleteSongFromPlaylist(Long playlistId, String songId) {
        PlaylistEntity playlist = getPlaylistById(playlistId);
        boolean isSongDeleted = playlist.deleteSong(songId);
        if (!isSongDeleted) {
            throw new ResourceNotFoundException("Song with id %s not found in playlist".formatted(songId));
        }
    }

    @Transactional
    public void deletePlaylistById(Long id) {
        // dummy user
        UserEntity user = userService.getUserById(1L);
        PlaylistEntity playlist = user.getPlaylists().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id %d not found".formatted(id)));
        user.deletePlaylist(playlist);
    }

    @Transactional
    public void updatePlaylist(Long id, PlaylistEntity updatedPlaylist, MultipartFile preview) throws IOException {
        PlaylistEntity playlist = getPlaylistById(id);

        if (nonNull(preview)) {
            String newPreviewId = imageService.saveImage(preview);
            imageService.deleteImageById(playlist.getPreviewId());
            playlist.setPreviewId(newPreviewId);
        }

        playlist.setName(updatedPlaylist.getName());
    }
}
