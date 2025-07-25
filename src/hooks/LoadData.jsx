
import { getAccountBalance, getChainId, getProvider, getSigner } from '../Slice/ProviderSlice';
import { ethers, providers } from 'ethers'
import { getTokenCAPBalance, getTokenContract, getTokenmDaiBalance, getTokenmEthBalance } from '../Slice/TokenSlice';
import TokenAbi from '../abis/TokenAbi.json'
import ExchangeAbi from '../abis/ExchangeAbi.json'
import { getchangeEvent, getExchangeContract, getEXTokenCAPBalance, getEXTokenmDaiBalance, getEXTokenmEthBalance } from '../Slice/ExchangeSlice';
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

export const transferTokens = async (dispatch, token, amount, provider, exchange, action) => {

    let transaction;

  const signer = await provider.getSigner();
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
  else{
    
    // withdraw amount
    transaction = await exchange.connect(signer).withdrawToken(token.address, amounttoTranfer);
    const withdrawReceipt = await transaction.wait();
       if (withdrawReceipt.status !== 1) {
      toast.error(" withdrawReceipt  failed!")
      return;
    }
    else if (withdrawReceipt.status === 1) {
      const event =  withdrawReceipt.events?.find(e => e.event === "Withdraw");
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


