import { createSlice } from "@reduxjs/toolkit"

export const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        user: [],
    },
    reducers: {
        addUser: (state, action) => {
            state.todo.push(action.payload)
        }, setComplete: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        }
    }
})
export default todoSlice.reducer;

export const {
    addUser,
    setComplete,
} = todoSlice.actions
export const getTodos = (state) => state.todos.user