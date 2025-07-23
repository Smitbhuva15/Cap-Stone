import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token_contarct: {
    contract: {},
    symbol: ''
  }
};

const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getTokenContract(state, action) {
      state.token_contarct = action.payload;
    }
  }
});

export const { getTokenContract } = TokenSlice.actions;
export default TokenSlice.reducer;
