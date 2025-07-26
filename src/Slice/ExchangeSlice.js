import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Exchange_contract: {},
  ExchangeCAP_Balance: 0,
  ExchangemDai_Balance: 0,
  ExchangemEth_Balance: 0,
  event: true,
  allOrders: [],
  buyordermETH:[],
  buyordermDAI:[],
  sellordermETH:[],
  sellordermDAI:[],
  eventfororders:true
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
    getchangeEvent(state) {
      state.event = !state.event
    },
    getallOrders(state, action) {

      const newOrder = action.payload;

      // Check if order already exists

      const exists = state.allOrders.some(order => order.id._hex === newOrder.id._hex);
      if (!exists) {
        state.allOrders.push(newOrder);
      }

    },
    getbuyordermETH(state,action){
      state.buyordermETH=action.payload
    },
    getbuyordermDAI(state,action){
      state.buyordermDAI=action.payload
    },
     getsellordermETH(state,action){
      state.sellordermETH=action.payload
    },
     getsellordermDAI(state,action){
      state.sellordermDAI=action.payload
    },
     getchangeEventforOrder(state) {
      state.eventfororders = !state.eventfororders
    },
    



  }
});

export const { getExchangeContract, getEXTokenmDaiBalance, getEXTokenmEthBalance, getEXTokenCAPBalance, getchangeEvent, getallOrders,  getbuyordermETH, getbuyordermDAI,getsellordermETH,getsellordermDAI, getchangeEventforOrder} = ExchangeSlice.actions;
export default ExchangeSlice.reducer;
