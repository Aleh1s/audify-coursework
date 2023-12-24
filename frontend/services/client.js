import axios from "axios";
import {API_BASE_URL} from "../constants/client.js";

export const getSongs = async (query, page, limit) => {
    return await axios.post(`${API_BASE_URL}/songs/search`, {query, page, limit})
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