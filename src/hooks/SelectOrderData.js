import { ethers } from "ethers";
import moment from 'moment'
import config from '../config.json'
import { getbuyorder, getchartData, getMyTradeData, getMyTransactionData, getsellorder, getTradeData } from "../Slice/ExchangeSlice";
import {  groupBy, maxBy, minBy } from 'lodash';



const GREEN = '#25CE8F'
const RED = '#F45353'
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


const SelectOrderData = (dispatch, token_contract, Allorders, allCancelOrders, allFilledOrders, chainId) => {



  let enhancedOrders = RejectOrder(Allorders, allCancelOrders, allFilledOrders)

  enhancedOrders = enhancedOrders.map(order => {
    if (order.tokenGet == token_contract[0]?.contract1.address) {
      return { ...order, type: "buy", tokenPriceclass: GREEN };
    } else {
      return { ...order, type: "sell", tokenPriceclass: RED };
    }

  });

  // filter orders ---> mETH and mDAI
  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGet === token_contract[0].contract1.address ||
    order.tokenGet === token_contract[0].contract2.address
  );

  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGive === token_contract[0].contract1.address ||
    order.tokenGive === token_contract[0].contract2.address
  );


  const addamount = decorateOrder(enhancedOrders, token_contract, chainId);

  const buyorder = addamount.filter(
    (order) => order.type === 'buy'
  ).sort((a, b) => b.tokenPrice - a.tokenPrice);
  dispatch(getbuyorder(buyorder));

  const sellorder = addamount.filter(
    (order) => order.type === 'sell'
  ).sort((a, b) => b.tokenPrice - a.tokenPrice);
  dispatch(getsellorder(sellorder))


}


const decorateOrder = (enhancedOrders, token_contract, chainId) => {

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
      formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa  MMM D'),
    })

  })
  return addamounts;
}

export const MyTransactionData = (dispatch, token_contract, Allorders, allCancelOrders, allFilledOrders, account, chainId) => {


  // Filter orders created by current account
  let enhancedOrders = Allorders?.filter((o) => o.user.toLowerCase() == account.toLowerCase());
  // Remove cancelled or filled orders
  enhancedOrders = RejectOrder(enhancedOrders, allCancelOrders, allFilledOrders);

  // Filter only relevant tokens (mETH and mDAI)
  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGet === token_contract[0].contract1.address ||
    order.tokenGet === token_contract[0].contract2.address
  );

  enhancedOrders = enhancedOrders.filter(order =>
    order.tokenGive === token_contract[0].contract1.address ||
    order.tokenGive === token_contract[0].contract2.address
  );

  // Tag orders as buy/sell and set color
  enhancedOrders = enhancedOrders.map(order => {
    if (order.tokenGet === token_contract[0]?.contract1.address) {
      return { ...order, type: "buy", tokenPriceclass: GREEN };
    } else {
      return { ...order, type: "sell", tokenPriceclass: RED };
    }
  });


  enhancedOrders = decorateOrder(enhancedOrders, token_contract, chainId);
  enhancedOrders = enhancedOrders.sort((a, b) => b.timestamp - a.timestamp)
  dispatch(getMyTransactionData(enhancedOrders));
};

export const TradeOrders = async (fillOrder, token_contract, chainId, dispatch) => {
  let filledOrders;
  // filter orders ---> mETH and mDAI
  filledOrders = fillOrder.filter(order =>
    order.tokenGet === token_contract[0].contract1.address ||
    order.tokenGet === token_contract[0].contract2.address
  );

  filledOrders = filledOrders.filter(order =>
    order.tokenGive === token_contract[0].contract1.address ||
    order.tokenGive === token_contract[0].contract2.address
  );


  filledOrders = decorateOrder(filledOrders, token_contract, chainId)

  // Sort orders by time ascending for price comparison
  filledOrders = filledOrders.sort((a, b) => a.timestamp - b.timestamp);

  filledOrders = decorateFilledOrders(filledOrders);
  // Sort orders by date descending for display
  filledOrders = filledOrders.sort((a, b) => b.timestamp - a.timestamp);

  dispatch(getTradeData(filledOrders));

}

const decorateFilledOrders = (orders) => {
  // Track previous order to compare history
  let previousOrder = orders[0]

  return (
    orders.map((order) => {
      // decorate each individual order
      order = decorateFilledOrder(order, previousOrder)
      previousOrder = order  // Update the previous order once it's decorated
      return order
    })
  )
}

const decorateFilledOrder = (order, previousOrder) => {
  return ({
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
  })
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  // Show green price if only one order exists
  if (previousOrder.id === orderId) {
    return GREEN
  }

  // Show green price if order price higher than previous order
  // Show red price if order price lower than previous order
  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN
  } else {
    return RED
  }
}


export const myTradeOrder = (dispatch, fillOrder, token_contract, chainId, account) => {
  let filledOrders;

  filledOrders = fillOrder.filter((o) => o.user.toLowerCase() === account.toLowerCase() || o.creator.toLowerCase() === account.toLowerCase())

  // filter orders ---> mETH and mDAI

  filledOrders = filledOrders.filter(order =>
    order.tokenGet === token_contract[0].contract1.address ||
    order.tokenGet === token_contract[0].contract2.address
  );

  filledOrders = filledOrders.filter(order =>
    order.tokenGive === token_contract[0].contract1.address ||
    order.tokenGive === token_contract[0].contract2.address
  );


  filledOrders = decorateOrder(filledOrders, token_contract, chainId)

  filledOrders = decorateMyTradeOrders(filledOrders, account, token_contract);
  // Sort orders by date descending for display
  filledOrders = filledOrders.sort((a, b) => b.timestamp - a.timestamp);

  dispatch(getMyTradeData(filledOrders));
}

const decorateMyTradeOrders = (orders, account, token_contract) => {
  return (
    orders.map((order) => {
      order = decorateMyTradeOrder(order, account, token_contract)
      return (order)
    })
  )
}

const decorateMyTradeOrder = (order, account, token_contract) => {
  const myOrder = order.creator.toLowerCase() === account.toLowerCase()

  let orderType
  if (myOrder) {
    orderType = order.tokenGive === token_contract[0].contract2.address ? 'buy' : 'sell'
  } else {
    orderType = order.tokenGive === token_contract[0].contract2.address ? 'sell' : 'buy'
  }

  return ({
    ...order,
    orderType,
    orderClass: (orderType === 'buy' ? GREEN : RED),
    orderSign: (orderType === 'buy' ? '+' : '-')
  })
}

export const seriesChart = ( dispatch,fillOrder, token_contract,chainId) => {
  let filledOrders;

  // filter orders ---> mETH and mDAI

  filledOrders = fillOrder.filter(order =>
    order.tokenGet === token_contract[0].contract1.address ||
    order.tokenGet === token_contract[0].contract2.address
  );

  filledOrders = filledOrders.filter(order =>
    order.tokenGive === token_contract[0].contract1.address ||
    order.tokenGive === token_contract[0].contract2.address
  );

  // Sort orders by date ascending to compare history
  filledOrders = filledOrders.sort((a, b) => a.timestamp - b.timestamp);

  filledOrders = decorateOrder(filledOrders, token_contract, chainId)

  // Get last 2 order for final price & price change
  let secondlastOrderPrice = filledOrders[filledOrders.length-2 ]?.tokenPrice;
  let lastOrderPrice = filledOrders[filledOrders.length-1]?.tokenPrice;


  dispatch( getchartData({
    lastOrderPrice,
    lastorderSign:lastOrderPrice>= secondlastOrderPrice ? "+" : "-",
    series: [{
      data: buildGraphData(filledOrders)
    }]
  }))

}


const buildGraphData = (orders) => {
  // Group the orders by **day**
  const groupedByDay = groupBy(orders, (o) =>
    moment.unix(o.timestamp).startOf('day').format()
  );

  // Get each day where data exists
  const days = Object.keys(groupedByDay);

  // Build the graph series
  const graphData = days.map((day) => {
    const group = groupedByDay[day];

    // Sort the group by timestamp to ensure correct open/close
    const sortedGroup = group.sort((a, b) => a.timestamp - b.timestamp);

    const prices = group.map((o) => o.tokenPrice);

    return {
      x: new Date(day), // x-axis: day
      y: [
        sortedGroup[0].tokenPrice,               // Open
        Math.max(...prices),                     // High
        Math.min(...prices),                     // Low
        sortedGroup[sortedGroup.length - 1].tokenPrice // Close
      ]
    };
  });

  return graphData;
};

export default SelectOrderData