import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/user-slice'
// create store
const store = configureStore({
    reducer: userSlice
})

export default store