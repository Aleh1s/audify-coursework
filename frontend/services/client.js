import axios from "axios";
import {API_BASE_URL} from "../constants/client.js";

export const getSongs = async (query, page, limit, categoryId) => {
    return await axios.post(`${API_BASE_URL}/songs/search`, {query, page, limit, categoryId})
}

export const getCategories = async () => {
    return await axios.get(`${API_BASE_URL}/songs/categories`)
}

export const saveSong = async (song, preview, audio) => {
    const formData = new FormData();
    formData.append('preview', preview);
    formData.append('audio', audio);
    formData.append('song', new Blob([JSON.stringify(song)], {type: 'application/json'}));
    return await axios.post(`${API_BASE_URL}/songs`, formData)
}

export const getSongById = async (id) => {
    return await axios.get(`${API_BASE_URL}/songs/${id}`)
}

export const createPlaylist = async (playlist, preview) => {
    const formData = new FormData();
    formData.append('preview', preview);
    formData.append('playlist', new Blob([JSON.stringify(playlist)], {type: 'application/json'}));
    return await axios.post(`${API_BASE_URL}/playlists`, formData)
}

export const getPlaylists = async () => {
    return await axios.get(`${API_BASE_URL}/playlists`)
}

export const getPlaylistById = async (id) => {
    return await axios.get(`${API_BASE_URL}/playlists/${id}`)
}

export const getSongsByPlaylistId = async (id, page, limit) => {
    return await axios.get(`${API_BASE_URL}/playlists/${id}/songs?page=${page}&limit=${limit}`)
}

export const deletePlaylistById = async (id) => {
    return await axios.delete(`${API_BASE_URL}/playlists/${id}`)
}

export const updatePlaylistById = async (id, playlist, preview) => {
    const formData = new FormData();
    if (preview) {
        formData.append('preview', preview);
    }
    formData.append('playlist', new Blob([JSON.stringify(playlist)], {type: 'application/json'}));
    return await axios.put(`${API_BASE_URL}/playlists/${id}`, formData)
}