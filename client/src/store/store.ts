import { configureStore } from '@reduxjs/toolkit'
import userStatusReducer from './slices/userStatusSlice'

export const store = configureStore({
  reducer: {
    userStatus: userStatusReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
