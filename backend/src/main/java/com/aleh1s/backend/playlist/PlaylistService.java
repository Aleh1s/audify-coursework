package com.aleh1s.backend.playlist;

import com.aleh1s.backend.exception.DuplicateResourceException;
import com.aleh1s.backend.exception.ForbiddenException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.image.ImageService;
import com.aleh1s.backend.song.SongService;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserService;
import com.aleh1s.backend.util.ContextUtil;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final ImageService imageService;
    private final SongService songService;
    private final UserService userService;
    private final CustomSongRepository customSongRepository;

    @Transactional
    public void savePlaylist(PlaylistEntity playlist, MultipartFile preview) throws IOException {
        UserEntity user = userService.getCurrentUser();
        requireUniquePlaylistName(playlist, user.getPlaylists());

        String previewId = imageService.saveImage(preview);
        playlist.setPreviewId(previewId);

        user.addPlaylist(playlist);
        playlistRepository.save(playlist);
    }


    public Set<PlaylistEntity> getPlaylists(String relatedSongId) {
        UserEntity user = userService.getCurrentUser();

        if (nonNull(relatedSongId)) {
            Set<PlaylistEntity> playlists = playlistRepository.findPlaylistEntitiesByOwnerId(user.getId());
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
        int totalSongs = playlistRepository.countSongsById(id);

        playlist.setTotalDurationInSeconds(totalDurationInSeconds);
        playlist.setTotalSongs(totalSongs);

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
            throw new DuplicateResourceException("Song already exists in playlist");
        }
    }

    @Transactional
    public void deleteSongFromPlaylist(Long playlistId, String songId) {
        PlaylistEntity playlist = getPlaylistById(playlistId);
        boolean isSongDeleted = playlist.deleteSong(songId);
        if (!isSongDeleted) {
            throw new ResourceNotFoundException("Song not found in playlist");
        }
    }

    @Transactional
    public void deletePlaylistById(Long id) {
        UserEntity user = userService.getCurrentUser();
        PlaylistEntity playlist = user.getPlaylists().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id %d not found".formatted(id)));

        if (playlist.isLikedSongsPlaylist()) {
            throw new ForbiddenException("Liked songs playlist can't be deleted");
        }

        user.deletePlaylist(playlist);
    }

    @Transactional
    public void updatePlaylist(Long id, PlaylistEntity updatedPlaylist, MultipartFile preview) throws IOException {
        PlaylistEntity playlist = getPlaylistById(id);

        if (playlist.isLikedSongsPlaylist()) {
            throw new ForbiddenException("Liked songs playlist can't be updated");
        }

        if (nonNull(preview)) {
            String newPreviewId = imageService.saveImage(preview);
            imageService.deleteImageById(playlist.getPreviewId());
            playlist.setPreviewId(newPreviewId);
        }

        playlist.setName(updatedPlaylist.getName());
    }

    public PlaylistEntity getLikedSongsPlaylist() {
        Long userId = ContextUtil.getPrincipal().getId();
        return playlistRepository.findLikedSongsPlaylistByOwnerIdFetchSongs(userId);
    }

    public void removeSongFromPlaylistsBySongId(String songId) {
        customSongRepository.removeSongFromPlaylistsBySongId(songId);
    }
}
