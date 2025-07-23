import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token_contarct: {}
}

const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getTokenContract(state, payload) {
      state.token_contarct = payload.actions
    },
  },
})

export const { getTokenContract } = TokenSlice.actions
export default TokenSlice.reducer