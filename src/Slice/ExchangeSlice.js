import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Exchange_contract: {},
  ExchangeCAP_Balance: 0,
  ExchangemDai_Balance: 0,
  ExchangemEth_Balance: 0,
  event: true,
  allOrders: [],
  allCancelOrders: [],
  allFilledOrders: [],
  buyorder: [],
  sellorder: [],
  eventfororders: true,
  Mytransactions: [],
  TradeData:[],
  MyTradeData:[],
  seriesChartData:{}
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
    getallCancelOrders(state, action) {

      const newCancelOrder = action.payload;

      // Check if order already exists

      const exists = state.allCancelOrders.some(order => order.id._hex === newCancelOrder.id._hex);
      if (!exists) {
        state.allCancelOrders.push(newCancelOrder);
      }

    },
    getallFilledOrders(state, action) {

      const newFilledOrder = action.payload;

      // Check if order already exists

      const exists = state.allFilledOrders.some(order => order.id._hex === newFilledOrder.id._hex);
      if (!exists) {
        state.allFilledOrders.push(newFilledOrder);
      }

    },
    getbuyorder(state, action) {
      state.buyorder = action.payload
    },

    getsellorder(state, action) {
      state.sellorder = action.payload
    },
    getchangeEventforOrder(state) {
      state.eventfororders = !state.eventfororders
    },
    getMyTransactionData(state, action) {
      state.Mytransactions = action.payload;
    },
    getTradeData(state, action) {
      state.TradeData = action.payload;
    },
     getMyTradeData(state, action) {
      state.MyTradeData = action.payload;
    },
    getchartData(state,action){
    state.seriesChartData=action.payload;
    }



  }
});

export const { getExchangeContract, getEXTokenmDaiBalance, getEXTokenmEthBalance, getEXTokenCAPBalance, getchangeEvent, getallOrders, getbuyorder, getsellorder, getchangeEventforOrder, getallFilledOrders, getallCancelOrders, getMyTransactionData ,getTradeData,getMyTradeData, getchartData} = ExchangeSlice.actions;
export default ExchangeSlice.reducer;
