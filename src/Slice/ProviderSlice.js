import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    signer:"",
    providerconnection:{},
    chainId:""
 }

const ProviderSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    getSigner(state,payload){
      state.signer=payload.actions;
    },
    getProvider(state,payload){
        state.providerconnection=payload.actions;
    },
    getChainId(state,payload){
        state.chainId=payload.actions;
    }
  },
})

export const { getSigner, getProvider,getChainId  } = ProviderSlice.actions
export default ProviderSlice.reducer