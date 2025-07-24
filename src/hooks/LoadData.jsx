
import { getAccountBalance, getChainId, getProvider, getSigner } from '../Slice/ProviderSlice';
import { ethers } from 'ethers'
import { getTokenContract } from '../Slice/TokenSlice';
import TokenAbi from '../abis/TokenAbi.json'
import ExchangeAbi from '../abis/ExchangeAbi.json'
import { getExchangeContract } from '../Slice/ExchangeSlice';


export const loadAccount = async (dispatch,provider) => {
  let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
 const account = accounts[0]
 
 dispatch(getSigner(account));

 let balance = await provider.getBalance(account)
  balance = ethers.utils.formatEther(balance)
  dispatch( getAccountBalance(balance))
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
  dispatch(getTokenContract({contract1, contract2,symbol1, symbol2 }))
}

export const loadExhange = async (dispatch, contractaddress, provider) => {

  let contract = new ethers.Contract(contractaddress, ExchangeAbi, provider);
  dispatch(getExchangeContract( contract ))
 
}


