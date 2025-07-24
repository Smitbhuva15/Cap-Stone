import { configureStore } from '@reduxjs/toolkit'
import ProviderSlice from '../Slice/ProviderSlice'
import  TokenSlice from '../Slice/TokenSlice'
import ExchangeSlice from '../Slice/ExchangeSlice'

export const store = configureStore({
  reducer: {
    'provider':ProviderSlice,
    "token": TokenSlice,
    "exchange":ExchangeSlice
  },
})