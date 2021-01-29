import { createSlice } from "@reduxjs/toolkit"

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        profile: [],
    },
    reducers: {
        addProfile: (state, action) => {
            state.profile = (action.payload)
        },
    }
})
export default userReducer.reducer;

export const {
    addProfile,

} = userReducer.actions
