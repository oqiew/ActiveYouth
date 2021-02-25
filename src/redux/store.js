import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from './Reducer';


export default configureStore({
    reducer: {
        userReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
})