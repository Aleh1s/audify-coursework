import axios from "axios";
import {API_BASE_URL} from "../constants/client.js";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    }
})


export const getSongs = async (query, page, limit, categoryId) => {
    return await axios.post(`${API_BASE_URL}/songs/search`,
        {query, page, limit, categoryId},
        getAuthConfig()
    )
}

export const getCategories = async () => {
    return await axios.get(`${API_BASE_URL}/songs/categories`, getAuthConfig())
}

export const saveSong = async (song, preview, audio) => {
    const formData = new FormData();
    formData.append('preview', preview);
    formData.append('audio', audio);
    formData.append('song', new Blob([JSON.stringify(song)], {type: 'application/json'}));
    return await axios.post(`${API_BASE_URL}/songs`, formData, getAuthConfig())
}

export const getSongById = async (id) => {
    return await axios.get(`${API_BASE_URL}/songs/${id}`, getAuthConfig())
}

export const createPlaylist = async (playlist, preview) => {
    const formData = new FormData();
    formData.append('preview', preview);
    formData.append('playlist', new Blob([JSON.stringify(playlist)], {type: 'application/json'}));
    return await axios.post(`${API_BASE_URL}/playlists`, formData, getAuthConfig())
}

export const getPlaylists = async (relatedSongId) => {
    return await axios.get(`${API_BASE_URL}/playlists${relatedSongId ? `?related_song=${relatedSongId}` : ''}`, getAuthConfig())
}

export const getPlaylistById = async (id) => {
    return await axios.get(`${API_BASE_URL}/playlists/${id}`, getAuthConfig())
}

export const getSongsByPlaylistId = async (id, page, limit) => {
    return await axios.get(`${API_BASE_URL}/playlists/${id}/songs?page=${page}&limit=${limit}`, getAuthConfig())
}

export const deletePlaylistById = async (id) => {
    return await axios.delete(`${API_BASE_URL}/playlists/${id}`, getAuthConfig())
}

export const updatePlaylistById = async (id, playlist, preview) => {
    const formData = new FormData();
    if (preview) {
        formData.append('preview', preview);
    }
    formData.append('playlist', new Blob([JSON.stringify(playlist)], {type: 'application/json'}));
    return await axios.put(`${API_BASE_URL}/playlists/${id}`, formData, getAuthConfig())
}

export const addSongToPlaylist = async (playlistId, songId) => {
    return await axios.post(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, null, getAuthConfig())
}

export const removeSongFromPlaylist = async (playlistId, songId) => {
    return await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, getAuthConfig())
}

export const login = async (credentials) => {
    return await axios.post(`${API_BASE_URL}/auth/login`, credentials)
}

export const register = async (user) => {
    return await axios.post(`${API_BASE_URL}/registration`, user)
}

export const getUserByEmail = async (email) => {
    return await axios.get(`${API_BASE_URL}/users/${email}`, getAuthConfig())
}

export const blockUser = async (email) => {
    return await axios.post(`${API_BASE_URL}/users/${email}/block`, null, getAuthConfig())
}

export const unblockUser = async (email) => {
    return await axios.post(`${API_BASE_URL}/users/${email}/unblock`, null, getAuthConfig())
}

export const changePassword = async (email, password) => {
    return await axios.patch(`${API_BASE_URL}/users/${email}/password`, {password}, getAuthConfig())
}