import {createSlice} from "@reduxjs/toolkit";

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        currentSong: null
    },
    reducers: {
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
        }
    }
})

export const {setCurrentSong} = playerSlice.actions;
export default playerSlice.reducer;