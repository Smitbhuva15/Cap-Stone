import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token_contract: []
};

const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getTokenContract(state, action) {
      state.token_contract.push(action.payload);
    }
  
  }
});

export const { getTokenContract } = TokenSlice.actions;
export default TokenSlice.reducer;
