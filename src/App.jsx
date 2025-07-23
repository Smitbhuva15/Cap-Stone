
import { useEffect } from 'react'
import './App.css'
import {ethers} from 'ethers'
import config from './config.json'
import TokenAbi from './abis/TokenAbi.json'

function App() {

  const loadBlockchain=async()=>{
  const account= await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log(account[0]);

  const provider=new ethers.providers.Web3Provider(window.ethereum);
  const {chainId}=await provider.getNetwork();
  console.log(chainId);

  const contract=new ethers.Contract(config[chainId].CAP.address,TokenAbi,provider);
  console.log(contract)
  }
 
  useEffect(()=>{
    loadBlockchain();
  },[])

  return (
    <>
    hello 
    </>
  )
}

export default App
