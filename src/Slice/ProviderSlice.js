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
    getSigner(state,action){
      state.signer=action.payload;
    },
    getProvider(state,action){
        state.providerconnection=action.payload;
    },
    getChainId(state,action){
        state.chainId=action.payload;
    }
  },
})

export const { getSigner, getProvider,getChainId  } = ProviderSlice.actions
export default ProviderSlice.reducer