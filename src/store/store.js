import { configureStore } from '@reduxjs/toolkit'
import TokenReducer from '../Slice/TokenSlice'

export const store = configureStore({
  reducer: {
    'Token':TokenReducer
  },
})