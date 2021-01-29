import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Reducer';
export default configureStore({
    reducer: {
        userReducer
    }
})