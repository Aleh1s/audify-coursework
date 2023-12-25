import {createSlice} from "@reduxjs/toolkit";

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        currentSongId: null,
    },
    reducers: {
        setCurrentSongId: (state, action) => {
            state.currentSongId = action.payload;
        }
    }
})

export const {setCurrentSongId} = playerSlice.actions;
export default playerSlice.reducer;