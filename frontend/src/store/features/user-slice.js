import { createSlice } from '@reduxjs/toolkit'
// crate slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        role: null,
        token: 'jsjsj'
    },
    reducers: {
        setCredentials: (state, action) => {
            return { ...state, ...action.payload }
        },
        logOut: (state) => {
            state.email = null,
                state.role = null,
                state.token = null
        }
    }
})

export const { setCredentials, logOut } = userSlice.actions;

export default userSlice.reducer