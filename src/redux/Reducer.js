import { createSlice } from "@reduxjs/toolkit"

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        profile: [],
        area: []
    },
    reducers: {
        addProfile: (state, action) => {
            state.profile = (action.payload)
        },
        setArea: (state, action) => {
            state.area = (action.payload)
        },
    }
})
export default userReducer.reducer;

export const {
    addProfile,
    setArea

} = userReducer.actions
