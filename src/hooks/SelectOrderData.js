import { ethers } from "ethers";
import moment from 'moment'
import config from '../config.json'
import {  getbuyordermDAI, getbuyordermETH, getsellordermDAI, getsellordermETH } from "../Slice/ExchangeSlice";

const SelectOrderData = (dispatch, token_contarct, Allorders, chainId) => {

  const GREEN = '#25CE8F'
  const RED = '#F45353'


  const enhancedOrders = Allorders.map(order => {
    if (order.tokenGet == token_contarct[0]?.contract1.address) {
      return { ...order, type: "buy", tokenPriceclass: GREEN };
    } else {
      return { ...order, type: "sell", tokenPriceclass: RED };
    }

  });
  // console.log(enhancedOrders)

  const addamount = decorateOrder(enhancedOrders, token_contarct, chainId);

  const buyordermETH = addamount.filter(
    (order) => order.type === 'buy' && order.tokenName === 'mETH'
  ).sort((a, b) =>  b.tokenPrice-a.tokenPrice);
  dispatch(getbuyordermETH(buyordermETH));

  const buyordermDAI = addamount.filter(
    (order) => order.type === 'buy' && order.tokenName === 'mDAI'
  ).sort((a, b) =>  b.tokenPrice-a.tokenPrice);
  dispatch(getbuyordermDAI(buyordermDAI))

  const sellordermETH = addamount.filter(
    (order) => order.type === 'sell' && order.tokenName === 'mETH'
  ).sort((a, b) =>  b.tokenPrice-a.tokenPrice);
  dispatch(getsellordermETH(sellordermETH))

  const sellordermDAI = addamount.filter(
    (order) => order.type === 'sell' && order.tokenName === 'mDAI'
  ).sort((a, b) =>  b.tokenPrice-a.tokenPrice);
  dispatch(getsellordermDAI(sellordermDAI))


}

const decorateOrder = (enhancedOrders, token_contarct, chainId) => {
  console.log(enhancedOrders)
  let token0Amount, token1Amount

  // Note: CAP should be considered token0, mETH is considered token1
  const addamounts = enhancedOrders.map(order => {
    if (order.tokenGive === config[chainId].mETH.address || order.tokenGive ===  config[chainId].mDAI.address ) {
 
      token0Amount = order.amountGive // The amount of DApp we are giving
      token1Amount = order.amountGet // The amount of mETH we want...
    }
    else {
      token0Amount = order.amountGet // The amount of DApp we want
      token1Amount = order.amountGive // The amount of mETH we are giving...
    }

    // Calculate token price to 5 decimal places
    let tokenPrice;
    const precision = 100000
    if(token0Amount._hex== "0x00" || token1Amount._hex=="0x00"){
        tokenPrice = 0;
    }
    else{
     tokenPrice = (token1Amount / token0Amount)

    }
    tokenPrice = Math.round(tokenPrice * precision) / precision


    if (order.tokenGive === config[chainId].mETH.address || order.tokenGet === config[chainId].mETH.address) {
      return ({
        ...order,
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D'),
        tokenName: "mETH"
      })
    }
    else {
      return ({
        ...order,
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D'),
        tokenName: "mDAI"
      })
    }


  })
  return addamounts;
}

export default SelectOrderData