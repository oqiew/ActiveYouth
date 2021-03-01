import { createSlice } from "@reduxjs/toolkit"

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        profile: [],
        Area: []
    },
    reducers: {
        addProfile: (state, action) => {
            state.profile = (action.payload)
        },
        setArea: (state, action) => {
            state.Area = (action.payload)
        },
    }
})
export default userReducer.reducer;

export const {
    addProfile,
    setArea

} = userReducer.actions
