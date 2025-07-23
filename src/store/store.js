import { configureStore } from '@reduxjs/toolkit'
import ProviderSlice from '../Slice/ProviderSlice'
import  TokenSlice from '../Slice/TokenSlice'

export const store = configureStore({
  reducer: {
    'provider':ProviderSlice,
    "token": TokenSlice
  },
})