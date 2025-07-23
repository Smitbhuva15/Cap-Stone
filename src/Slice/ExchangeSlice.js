import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Exchange_contract:{}
};

const ExchangeSlice = createSlice({
  name: 'Exchange',
  initialState,
  reducers: {
    getExchangeContract(state, action) {
      state.Exchange_contract=action.payload
    }
  
  }
});

export const { getExchangeContract } = ExchangeSlice.actions;
export default ExchangeSlice.reducer;
