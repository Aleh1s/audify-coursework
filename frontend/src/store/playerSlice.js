import {createSlice} from "@reduxjs/toolkit";

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        currentSong: null,
        isSongPlaying: false,
    },
    reducers: {
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
            state.isSongPlaying = true;
        },
        playSong: (state) => {
            state.isSongPlaying = true;
        },
        pauseSong: (state) => {
            state.isSongPlaying = false;
        },
        removePlayer: (state) => {
            state.currentSong = null;
            state.isSongPlaying = false;
        }
    }
})

export const {
    setCurrentSong,
    playSong,
    pauseSong,
    removePlayer
} = playerSlice.actions;

export default playerSlice.reducer;