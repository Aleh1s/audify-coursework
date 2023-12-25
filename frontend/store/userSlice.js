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
        }
    }
})

export const {setLikedSongsPlaylistId, setPlaylists} = userSlice.actions;
export default userSlice.reducer;