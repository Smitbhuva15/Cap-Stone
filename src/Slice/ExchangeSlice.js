import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Exchange_contract: {},
  ExchangeCAP_Balance: 0,
  ExchangemDai_Balance: 0,
  ExchangemEth_Balance: 0,
  event:true,
};

const ExchangeSlice = createSlice({
  name: 'Exchange',
  initialState,
  reducers: {
    getExchangeContract(state, action) {
      state.Exchange_contract = action.payload
    },
    getEXTokenmDaiBalance(state, action) {
      state.ExchangemDai_Balance = action.payload;
    },
    getEXTokenmEthBalance(state, action) {
      state.ExchangemEth_Balance = action.payload;
    },
    getEXTokenCAPBalance(state, action) {
      state.ExchangeCAP_Balance = action.payload;
    },
    getchangeEvent(state){
      state.event=!state.event
    }

  }
});

export const { getExchangeContract,getEXTokenmDaiBalance,getEXTokenmEthBalance,getEXTokenCAPBalance,getchangeEvent } = ExchangeSlice.actions;
export default ExchangeSlice.reducer;
