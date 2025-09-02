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


export const transferTokens = async (
  dispatch,
  token,
  amount,
  provider,
  exchange,
  action,
  account,
  totalCAPbalance,
  totalmETHbalance,
  totalmDAIbalance,
  chainId
) => {
  let transaction;
  const amountNum = parseFloat(amount);
  const signer = await provider.getSigner();

  if (!account) {
    toast.error("Transaction failed. Please connect your wallet.", { id: "tokenTx" });
    return;
  }

  // Balance check
  if (token.address.toLowerCase() === config[chainId]?.CAP?.address.toLowerCase()) {
    if (amountNum > totalCAPbalance) {
      toast.error("Insufficient CAP balance.", { id: "tokenTx" });
      return;
    }
  } else if (token.address.toLowerCase() === config[chainId]?.mETH?.address.toLowerCase()) {
    if (amountNum > totalmETHbalance) {
      toast.error("Insufficient mETH balance.", { id: "tokenTx" });
      return;
    }
  } else {
    if (amountNum > totalmDAIbalance) {
      toast.error("Insufficient mDAI balance.", { id: "tokenTx" });
      return;
    }
  }

  const amountToTransfer = ethers.utils.parseEther(amount.toString(), 18);

  if (action === "Deposit") {
    try {
      // Approval
      toast.loading("Approval pending... Confirm the transaction in your wallet.", { id: "tokenTx" });
      transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);

      toast.loading("Approval submitted. Waiting for confirmation...", { id: "tokenTx" });
      const approveReceipt = await transaction.wait();

      if (approveReceipt.status !== 1) {
        toast.error("Approval failed. Please try again.", { id: "tokenTx" });
        return;
      }
      toast.success("Token approval successful.", { id: "tokenTx" });

      // Deposit
      toast.loading("Deposit pending... Confirm the transaction in your wallet.", { id: "tokenTx" });
      transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer);

      toast.loading("Deposit submitted. Waiting for confirmation...", { id: "tokenTx" });
      const depositReceipt = await transaction.wait();

      if (depositReceipt.status !== 1) {
        toast.error("Deposit transaction failed. Please try again.", { id: "tokenTx" });
        return;
      }

      const event = depositReceipt.events?.find((e) => e.event === "Deposit");
      if (event) {
        const { amount } = event.args;
        const formattedAmount = ethers.utils.formatEther(amount);
        toast.success(`${formattedAmount} tokens deposited successfully.`, { id: "tokenTx" });
        dispatch(getchangeEvent());
      } else {
        toast.error("Transaction confirmed but no Deposit event found.", { id: "tokenTx" });
      }
    } catch (error) {
      toast.error("Deposit failed. Please check your wallet or network.", { id: "tokenTx" });
    }
  } else {
    try {
      // Withdraw
      toast.loading("Withdrawal pending... Confirm the transaction in your wallet.", { id: "tokenTx" });
      transaction = await exchange.connect(signer).withdrawToken(token.address, amountToTransfer);

      toast.loading("Withdrawal submitted. Waiting for confirmation...", { id: "tokenTx" });
      const withdrawReceipt = await transaction.wait();

      if (withdrawReceipt.status !== 1) {
        toast.error("Withdrawal transaction failed. Please try again.", { id: "tokenTx" });
        return;
      }

      const event = withdrawReceipt.events?.find((e) => e.event === "Withdraw");
      if (event) {
        const { amount } = event.args;
        const formattedAmount = ethers.utils.formatEther(amount);
        toast.success(`${formattedAmount} tokens withdrawn successfully.`, { id: "tokenTx" });
        dispatch(getchangeEvent());
      } else {
        toast.error("Transaction confirmed but no Withdraw event found.", { id: "tokenTx" });
      }
    } catch (error) {
      toast.error("Withdrawal failed. Please check your wallet or network.", { id: "tokenTx" });
    }
  }
};



export const makeorder = async (
  dispatch,
  token_contract,
  order,
  provider,
  exchange,
  action,
  account,
  totalexchangeCAPBalance,
  totalexchangemETHBalance,
  totalexchangemDAIBalance,
  chainId) => {

  let transaction;

  if (!account) {
    toast.error("Transaction failed. Please connect your wallet first.");
    return;
  }

  const amountNum = parseFloat(order.amount);
  const amountPrice = parseFloat(order.price);
  const signer = await provider.getSigner();

  try {
    if (action === "Buy") {
      const totalRequireBalance = amountNum * amountPrice;

      if (token_contract[0].contract2.address.toLowerCase() === config[chainId].mETH.address.toLowerCase()) {
        if (totalRequireBalance > totalexchangemETHBalance) {
          toast.error("Insufficient mETH balance in CapXchange.");
          return;
        }
      } else {
        if (totalRequireBalance > totalexchangemDAIBalance) {
          toast.error("Insufficient mDAI balance in CapXchange.");
          return;
        }
      }

      const tokenGet = token_contract[0].contract1.address;
      const amountGet = ethers.utils.parseEther(order.amount.toString(), 18);
      const tokenGive = token_contract[0].contract2.address;
      const amountGive = ethers.utils.parseEther((order.amount * order.price).toString(), 18);

      toast.loading("Placing buy order... Please confirm the transaction in your wallet.", {
        id: "orderTx",
      });

      transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);

      toast.loading("Transaction submitted. Waiting for confirmation...", {
        id: "orderTx",
      });

      const buyReceipt = await transaction.wait();

      if (buyReceipt.status !== 1) {
        toast.error("Buy order failed. Please try again.", { id: "orderTx" });
        return;
      }

      const event = buyReceipt.events?.find(e => e.event === "Order");
      if (event) {
        toast.success("Buy order placed successfully!", { id: "orderTx" });
        dispatch(getchangeEventforOrder());
      } else {
        toast.error("Transaction confirmed but no Order event found.", { id: "orderTx" });
      }
    } else {
      if (amountNum > totalexchangeCAPBalance) {
        toast.error("Insufficient CAP balance in CapXchange.");
        return;
      }

      const tokenGet = token_contract[0].contract2.address;
      const amountGet = ethers.utils.parseEther((order.amount * order.price).toString(), 18);
      const tokenGive = token_contract[0].contract1.address;
      const amountGive = ethers.utils.parseEther(order.amount.toString(), 18);

      toast.loading("Placing sell order... Please confirm the transaction in your wallet.", {
        id: "orderTx",
      });

      transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);

      toast.loading("Transaction submitted. Waiting for confirmation...", {
        id: "orderTx",
      });

      const sellReceipt = await transaction.wait();

      if (sellReceipt.status !== 1) {
        toast.error("Sell order failed. Please try again.", { id: "orderTx" });
        return;
      }

      const event = sellReceipt.events?.find(e => e.event === "Order");
      if (event) {
        toast.success("Sell order placed successfully!", { id: "orderTx" });
        dispatch(getchangeEventforOrder());
      } else {
        toast.error("Transaction confirmed but no Order event found.", { id: "orderTx" });
      }
    }
  } catch (error) {
    toast.error("Transaction failed. Please try again later.", { id: "orderTx" });
  }
};


export const loadAllOrder = async (dispatch, provider, exchange) => {

  // this function get all the orders  
  const latestblock = await provider.getBlockNumber()

  const OrderStream = await exchange.queryFilter('Order', 0, latestblock)

  const CancelStream = await exchange.queryFilter('Cancel', 0, latestblock)

  const tradeStream = await exchange.queryFilter('Trade', 0, latestblock)

  OrderStream.map(order => dispatch(getallOrders(order.args)))
  CancelStream.map(order => dispatch(getallCancelOrders(order.args)))
  tradeStream.map(order => dispatch(getallFilledOrders(order.args)))

}


export const cancelOrder = async (order, exchange, provider) => {
  if (!order?.id) {
    toast.error("Invalid order. Cannot cancel.");
    return;
  }

  toast.loading("Cancelling order... Please confirm the transaction in your wallet.", {
    id: "cancelTx",
  });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).cancelOrder(order.id);

    toast.loading("Transaction submitted. Waiting for confirmation...", {
      id: "cancelTx",
    });

    const result = await transaction.wait();

    if (result.status !== 1) {
      toast.error("Order cancellation failed. Please try again.", {
        id: "cancelTx",
      });
      return;
    }

    const event = result.events?.find((e) => e.event === "Cancel");
    if (event) {
      toast.success("Order has been cancelled successfully.", {
        id: "cancelTx",
      });
    } else {
      toast.error("Transaction confirmed but no Cancel event found.", {
        id: "cancelTx",
      });
    }
  } catch (error) {
    toast.error("Transaction failed. Please try again.", {
      id: "cancelTx",
    });
  }
};

export const loadFilledOrder = async (order, exchange, provider) => {
  if (!order?.id) {
    toast.error("Invalid order. Cannot fill.");
    return;
  }

  toast.loading("Filling order... Please confirm the transaction in your wallet.", {
    id: "fillTx",
  });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).fillOrder(order.id);

    toast.loading("Transaction submitted. Waiting for confirmation...", {
      id: "fillTx",
    });

    const result = await transaction.wait();

    if (result.status !== 1) {
      toast.error("Order filling failed. Please try again.", {
        id: "fillTx",
      });
      return;
    }

    const event = result.events?.find((e) => e.event === "Trade");
    if (event) {
      toast.success("Order has been filled successfully.", {
        id: "fillTx",
      });
    } else {
      toast.error("Transaction confirmed but no Trade event found.", {
        id: "fillTx",
      });
    }
  } catch (error) {
    toast.error("Transaction failed. Please try again.", {
      id: "fillTx",
    });
  }
};
