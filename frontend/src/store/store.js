import {configureStore} from "@reduxjs/toolkit";
import playerReducer from "./playerSlice.js";
import userReducer from "./userSlice.js";

export default configureStore({
    reducer: {
        player: playerReducer,
        user: userReducer,
    }
})