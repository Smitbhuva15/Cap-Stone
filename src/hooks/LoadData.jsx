
import { getAccountBalance, getChainId, getProvider, getSigner } from '../Slice/ProviderSlice';
import { ethers, providers } from 'ethers'
import { getTokenCAPBalance, getTokenContract, getTokenmDaiBalance, getTokenmEthBalance } from '../Slice/TokenSlice';
import TokenAbi from '../abis/TokenAbi.json'
import ExchangeAbi from '../abis/ExchangeAbi.json'
import { getallCancelOrders, getallFilledOrders, getallOrders, getchangeEvent, getchangeEventforOrder, getExchangeContract, getEXTokenCAPBalance, getEXTokenmDaiBalance, getEXTokenmEthBalance } from '../Slice/ExchangeSlice';
import config from '../config.json'
import toast from 'react-hot-toast';



export const loadAccount = async (dispatch, provider) => {
  let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = accounts[0]

  dispatch(getSigner(account));

  let balance = await provider.getBalance(account)
  balance = ethers.utils.formatEther(balance)
  dispatch(getAccountBalance(balance))
  return account;
}


export const loadProvider = async (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  dispatch(getProvider(provider))
  return provider;
}

export const loadChainId = async (dispatch, provider) => {
  const { chainId } = await provider.getNetwork();
  dispatch(getChainId(chainId))
  return chainId;
}

export const loadcontract = async (dispatch, contractaddress, provider) => {

  let contract1 = new ethers.Contract(contractaddress[0], TokenAbi, provider);
  let symbol1 = await contract1.symbol();

  const contract2 = new ethers.Contract(contractaddress[1], TokenAbi, provider);
  const symbol2 = await contract2.symbol();
  dispatch(getTokenContract({ contract1, contract2, symbol1, symbol2 }))
}

export const loadExhange = async (dispatch, contractaddress, provider) => {

  let contract = new ethers.Contract(contractaddress, ExchangeAbi, provider);
  dispatch(getExchangeContract(contract))

  return contract;

}

export const loadbalance = async (dispatch, contracts, exchange, account, chainId) => {
  const CAP_Balance = await contracts[0]?.contract1?.balanceOf(account);
  const cap_balance = ethers.utils.formatEther(CAP_Balance)
  dispatch(getTokenCAPBalance(cap_balance))

  const METH_Balance = await contracts[0]?.contract2?.balanceOf(account);
  const mETH_balance = ethers.utils.formatEther(METH_Balance)
  dispatch(getTokenmEthBalance(mETH_balance))

  const MDAI_Balance = await contracts[0]?.contract2?.balanceOf(account);
  const mDAI_balance = ethers.utils.formatEther(MDAI_Balance)
  dispatch(getTokenmDaiBalance(mDAI_balance))

  const CAP_EXCHANGE_Balance = await exchange.balanceOf(config[chainId]?.CAP?.address, account);
  const cap_EXCHANGE_balance = ethers.utils.formatEther(CAP_EXCHANGE_Balance)
  dispatch(getEXTokenCAPBalance(cap_EXCHANGE_balance))

  const MDAI_EXCHANGE_Balance = await exchange.balanceOf(config[chainId]?.mDAI?.address, account);
  const mDAI_EXCHANGE_balance = ethers.utils.formatEther(MDAI_EXCHANGE_Balance)
  dispatch(getEXTokenmDaiBalance(mDAI_EXCHANGE_balance))

  const METH_EXCHANGE_Balance = await exchange.balanceOf(config[chainId]?.mETH?.address, account);
  const mETH_EXCHANGE_balance = ethers.utils.formatEther(METH_EXCHANGE_Balance)
  dispatch(getEXTokenmEthBalance(mETH_EXCHANGE_balance))



}

export const transferTokens = async (dispatch, token, amount, provider, exchange, action, account, totalCAPbalance, totalmETHbalance, totalmDAIbalance, chainId) => {

  let transaction;
  const amountNum = parseFloat(amount);

  const signer = await provider.getSigner();

  if (!account) {
    toast.error("transaction failed! Please Connect with Metamask ");
    return;
  }

  if (token.address.toLowerCase() === config[chainId]?.CAP?.address.toLowerCase()) {
    if (amountNum > totalCAPbalance) {
      toast.error("Transaction failed! Insufficient CAP balance.");
      return;
    }
  }
  else if (token.address.toLowerCase() === config[chainId]?.mETH?.address.toLowerCase()) {
    if (amountNum > totalmETHbalance) {
      toast.error("Transaction failed! Insufficient mETH balance.");
      return;
    }
  }
  else {
    if (amountNum > totalmDAIbalance) {
      toast.error("Transaction failed! Insufficient mDAI balance.");
      return;
    }
  }


  const amounttoTranfer = ethers.utils.parseEther(amount.toString(), 18);
  if (action === 'Deposit') {
    toast('Approval pending...', {
      icon: '⏳',
    });

    //approve amount
    transaction = await token.connect(signer).approve(exchange.address, amounttoTranfer);
    const approveReceipt = await transaction.wait();

    if (approveReceipt.status !== 1) {
      toast.error("Approve transaction failed!")
      return;
    }
    toast.success("Approval successful!")

    toast('Deposit pending...', {
      icon: '⏳',
    });

    // deposit amount
    transaction = await exchange.connect(signer).depositToken(token.address, amounttoTranfer);
    const depositReceipt = await transaction.wait();


    if (depositReceipt.status !== 1) {
      toast.error("Deposit transaction failed!")
      return;
    }
    else if (depositReceipt.status === 1) {
      const event = depositReceipt.events?.find(e => e.event === "Deposit");
      if (event) {
        const { amount } = event.args;
        const formattedAmount = ethers.utils.formatEther(amount);
        toast.success(` ${formattedAmount} tokens deposited successfully!`);
        dispatch(getchangeEvent());
      }
      else {
        toast.error(" Deposit transaction failed!");
      }
    }
  }
  else {

    // withdraw amount
    toast('withdraw pending...', {
      icon: '⏳',
    });
    transaction = await exchange.connect(signer).withdrawToken(token.address, amounttoTranfer);
    const withdrawReceipt = await transaction.wait();
    if (withdrawReceipt.status !== 1) {
      toast.error(" withdraw transaction failed!")
      return;
    }
    else if (withdrawReceipt.status === 1) {
      const event = withdrawReceipt.events?.find(e => e.event === "Withdraw");
      if (event) {
        const { amount } = event.args;
        const formattedAmount = ethers.utils.formatEther(amount);
        toast.success(` ${formattedAmount} tokens withdraw successfully!`);
        dispatch(getchangeEvent());
      }
      else {
        toast.error(" withdraw transaction failed!");
      }
    }

  }


}


export const makeorder = async (dispatch, token_contract, order, provider, exchange, action, account, totalexchangeCAPBalance, totalexchangemETHBalance, totalexchangemDAIBalance, chainId) => {

  let transaction;
  if (!account) {
    toast.error("transaction failed! Please Connect with Metamask ");
    return;
  }

  const amountNum = parseFloat(order.amount);
  const amountPrice = parseFloat(order.price);
  const signer = await provider.getSigner();

  if (action == "Buy") {
    const totalRequireBalance = amountNum * amountPrice * 1.0;

    if (token_contract[0].contract2.address.toLowerCase() === config[chainId].mETH.address.toLowerCase()) {
      if (totalRequireBalance > totalexchangemETHBalance) {
        toast.error("Transaction failed! Insufficient contract mETH balance.");
        return;
      }

    }
    else {

      if (totalRequireBalance > totalexchangemDAIBalance) {
        toast.error("Transaction failed! Insufficient contract mDAI balance.");
        return;
      }
    }

    const tokenGet = token_contract[0].contract1.address;
    const amountGet = ethers.utils.parseEther((order.amount).toString(), 18);
    const tokenGive = token_contract[0].contract2.address;
    const amountGive = ethers.utils.parseEther((order.amount * order.price).toString(), 18);

    toast('Order pending...', {
      icon: '⏳',
    });
    transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    const buyRecipt = await transaction.wait();

    if (buyRecipt.status !== 1) {
      toast.error("Failed to place order. Please try again!")
      return;
    }
    else if (buyRecipt.status === 1) {
      const event = buyRecipt.events?.find(e => e.event === "Order");
      if (event) {
        toast.success('Your order has been successfully placed!');
      }
      else {
        toast.error("Failed to place order. Please try again!")
      }
    }

    dispatch(getchangeEventforOrder())

  }
  else {

    if (amountNum > totalexchangeCAPBalance) {
      toast.error("Transaction failed! Insufficient contract CAP balance.");
      return;
    }


    const tokenGet = token_contract[0].contract2.address;
    const amountGet = ethers.utils.parseEther((order.amount * order.price).toString(), 18);
    const tokenGive = token_contract[0].contract1.address;
    const amountGive = ethers.utils.parseEther((order.amount).toString(), 18);

    toast('Order pending...', {
      icon: '⏳',
    });
    transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    const SellRecipt = await transaction.wait();

    if (SellRecipt.status !== 1) {
      toast.error("Failed to place order. Please try again!")
      return;
    }
    else if (SellRecipt.status === 1) {
      const event = SellRecipt.events?.find(e => e.event === "Order");
      if (event) {
        toast.success('Your order has been successfully placed!');
      }
      else {
        toast.error("Failed to place order. Please try again!")
      }
    }

    dispatch(getchangeEventforOrder())
  }


}

export const loadAllOrder = async (dispatch, provider, exchange) => {

  // this function get all the orders  
  const block = await provider.getBlockNumber()
  const OrderStream = await exchange.queryFilter('Order', 0, block)


  const CancelStream = await exchange.queryFilter('Cancel', 0, block)


  const tradeStream = await exchange.queryFilter('Trade', 0, block)

  OrderStream.map(order => dispatch(getallOrders(order.args)))
  CancelStream.map(order => dispatch(getallCancelOrders(order.args)))
  tradeStream.map(order => dispatch(getallFilledOrders(order.args)))


}


export const cancelOrder = async (order, exchange, provider) => {

  const signer = await provider.getSigner();
  let transaction = await exchange.connect(signer).cancelOrder(order.id);
  let result = await transaction.wait();
}

export const loadFilledOrder = async (order, exchange, provider) => {
  const signer = await provider.getSigner();
  let transaction = await exchange.connect(signer).fillOrder(order.id);
  let result = await transaction.wait();
}
