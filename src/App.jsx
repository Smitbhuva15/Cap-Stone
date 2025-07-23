
import { useEffect } from 'react'
import './App.css'
import { ethers } from 'ethers'
import config from './config.json'
import TokenAbi from './abis/TokenAbi.json'
import GetAccount from './hooks/GetAccount'
import GetProvider from './hooks/GetProvider'
import {  useDispatch } from 'react-redux'
import { getChainId, getProvider, getSigner } from './Slice/ProviderSlice'
import { getTokenContract } from './Slice/TokenSlice'


function App() {

  const dispatch=useDispatch();

  const loadBlockchain = async () => {

    const account = await GetAccount();
     dispatch(getSigner(account[0]));
    // console.log(account[0]);

    const provider = GetProvider();
    dispatch(getProvider(provider))
    // console.log(provider)

    const { chainId } = await provider.getNetwork();
    dispatch(getChainId(chainId))
    // console.log(chainId);

    const contractaddress = config[chainId].CAP.address;
    const contract = new ethers.Contract(contractaddress, TokenAbi, provider);
    dispatch(getTokenContract(contract))
    // console.log(contract)
  }

  useEffect(() => {
    loadBlockchain();
  }, [])

  return (
    <>
      hello
    </>
  )
}

export default App
