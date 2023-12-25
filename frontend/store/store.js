import {configureStore} from "@reduxjs/toolkit";
import playerReducer from "./playerSlice.js";

export default configureStore({
    reducer: {
        player: playerReducer
    }
})