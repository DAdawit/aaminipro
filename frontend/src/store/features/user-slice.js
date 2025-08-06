import { createSlice } from '@reduxjs/toolkit'
// crate slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        role: null,
        token: null
    },
    reducers: {
        setCredentials: (state, action) => {
            return { ...state, ...action.payload }
        },
        logOut: (state, action) => {
            state.email = null,
                state.role = null,
                state.token = null
        }
    }
})

export const { setCredentials, logOut } = userSlice.actions;

export default userSlice.reducer