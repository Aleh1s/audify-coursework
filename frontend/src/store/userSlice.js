import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        likedSongsPlaylistId: null,
        playlists: []
    },
    reducers: {
        setLikedSongsPlaylistId: (state, action) => {
            state.likedSongsPlaylistId = action.payload;
        },
        setPlaylists: (state, action) => {
            state.playlists = action.payload;
        },
        removeUser: (state) => {
            state.likedSongsPlaylistId = null;
            state.playlists = [];
        }
    }
})

export const {
    setLikedSongsPlaylistId,
    setPlaylists,
    removeUser
} = userSlice.actions;
export default userSlice.reducer;