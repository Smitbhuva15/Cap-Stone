import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  signer: "",
  providerconnection: {},
  chainId: "",
  balance:0
}

const ProviderSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    getSigner(state, action) {
      state.signer = action.payload;
    },
    getProvider(state, action) {
      state.providerconnection = action.payload;
    },
    getChainId(state, action) {
      state.chainId = action.payload;
    },
    getAccountBalance(state,action){
      state.balance=action.payload;
    }
  },
})

export const { getSigner, getProvider, getChainId , getAccountBalance} = ProviderSlice.actions
export default ProviderSlice.reducer