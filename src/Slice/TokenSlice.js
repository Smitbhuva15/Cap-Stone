import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token_contract: [],
  tokenCAP_Balance: 0,
  tokenmDai_Balance: 0,
  tokenmEth_Balance: 0,

};

const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getTokenContract(state, action) {
      state.token_contract = [action.payload];
    },
    getTokenmDaiBalance(state, action) {
      state.tokenmDai_Balance = action.payload;
    },
    getTokenmEthBalance(state, action) {
      state.tokenmEth_Balance = action.payload;
    },
    getTokenCAPBalance(state, action) {
      state.tokenCAP_Balance = action.payload;
    },

  }
});

export const { getTokenContract ,getTokenCAPBalance,getTokenmEthBalance,getTokenmDaiBalance} = TokenSlice.actions;
export default TokenSlice.reducer;
