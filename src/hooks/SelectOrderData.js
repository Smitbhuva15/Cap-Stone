import { ethers } from "ethers";
import moment from 'moment'
import config from '../config.json'
import { getbuyorder, getMyTransactionData, getsellorder } from "../Slice/ExchangeSlice";
import { useSelector } from "react-redux";

const RejectOrder = (Allorders, allCancelOrders, allFilledOrders) => {

  // Create a Set of all cancelled and filled order IDs for fast lookup
  const rejectedIds = new Set([
    ...allCancelOrders.map(order => order.id._hex),
    ...allFilledOrders.map(order => order.id._hex),
  ]);

  // Filter Allorders to remove orders with those IDs
  const activeOrders = Allorders.filter(order => !rejectedIds.has(order.id._hex));
  return activeOrders;

}


const SelectOrderData = (dispatch, token_contarct, Allorders, allCancelOrders, allFilledOrders, chainId) => {

  const GREEN = '#25CE8F'
  const RED = '#F45353'

  let enhancedOrders = RejectOrder(Allorders, allCancelOrders, allFilledOrders)

  enhancedOrders = enhancedOrders.map(order => {
    if (order.tokenGet == token_contarct[0]?.contract1.address) {
      return { ...order, type: "buy", tokenPriceclass: GREEN };
    } else {
      return { ...order, type: "sell", tokenPriceclass: RED };
    }

  });

  // filter orders ---> mETH and mDAI
  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGet === token_contarct[0].contract1.address ||
    order.tokenGet === token_contarct[0].contract2.address
  );

  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGive === token_contarct[0].contract1.address ||
    order.tokenGive === token_contarct[0].contract2.address
  );


  const addamount = decorateOrder(enhancedOrders, token_contarct, chainId);

  const buyorder = addamount.filter(
    (order) => order.type === 'buy'
  ).sort((a, b) => b.tokenPrice - a.tokenPrice);
  dispatch(getbuyorder(buyorder));

  const sellorder = addamount.filter(
    (order) => order.type === 'sell'
  ).sort((a, b) => b.tokenPrice - a.tokenPrice);
  dispatch(getsellorder(sellorder))


}


const decorateOrder = (enhancedOrders, token_contarct, chainId) => {

  let token0Amount, token1Amount

  // Note: CAP should be considered token0, mETH is considered token1
  const addamounts = enhancedOrders.map(order => {
    if (order.tokenGive === config[chainId].mETH.address || order.tokenGive === config[chainId].mDAI.address) {

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
    if (token0Amount._hex == "0x00" || token1Amount._hex == "0x00") {
      tokenPrice = 0;
    }
    else {
      tokenPrice = (token1Amount / token0Amount)

    }
    tokenPrice = Math.round(tokenPrice * precision) / precision


    return ({
      ...order,
      token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
      token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
      tokenPrice,
      formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D'),
    })

  })
  return addamounts;
}

export const MyTransactionData = (dispatch, token_contarct, Allorders, allCancelOrders, allFilledOrders, account, chainId) => {
  const GREEN = '#25CE8F';
  const RED = '#F45353';


  // Filter orders created by current account
  let enhancedOrders = Allorders?.filter((o) => o.user.toLowerCase() == account.toLowerCase());
  // Remove cancelled or filled orders
  enhancedOrders = RejectOrder(enhancedOrders, allCancelOrders, allFilledOrders);

  // Filter only relevant tokens (mETH and mDAI)
  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGet === token_contarct[0].contract1.address ||
    order.tokenGet === token_contarct[0].contract2.address
  );

  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGive === token_contarct[0].contract1.address ||
    order.tokenGive === token_contarct[0].contract2.address
  );

  // Tag orders as buy/sell and set color
  enhancedOrders = enhancedOrders.map(order => {
    if (order.tokenGet === token_contarct[0]?.contract1.address) {
      return { ...order, type: "buy", tokenPriceclass: GREEN };
    } else {
      return { ...order, type: "sell", tokenPriceclass: RED };
    }
  });


  enhancedOrders = decorateOrder(enhancedOrders, token_contarct, chainId);
   enhancedOrders = enhancedOrders.sort((a, b) => b.timestamp - a.timestamp)
  dispatch(getMyTransactionData(enhancedOrders));
};


export default SelectOrderData