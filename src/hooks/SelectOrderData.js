import { ethers } from "ethers";
import moment from 'moment'
import config from '../config.json'

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
  console.log(addamount);



}

const decorateOrder = (enhancedOrders, token_contarct, chainId) => {
  let token0Amount, token1Amount

  // Note: CAP should be considered token0, mETH is considered token1
  const addamounts = enhancedOrders.map(order => {
    if (order.tokenGive === token_contarct[0].contract2.address) {
      token0Amount = order.amountGive // The amount of DApp we are giving
      token1Amount = order.amountGet // The amount of mETH we want...
    }
    else {
      token0Amount = order.amountGet // The amount of DApp we want
      token1Amount = order.amountGive // The amount of mETH we are giving...
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (token1Amount / token0Amount)
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