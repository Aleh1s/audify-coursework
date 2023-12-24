import axios from "axios";
import {API_BASE_URL} from "../constants/client.js";

export const getSongs = async (query, page, limit) => {
    return await axios.post(`${API_BASE_URL}/songs/search`, {query, page, limit})
}