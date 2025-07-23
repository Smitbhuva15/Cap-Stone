import {  useDispatch } from 'react-redux'
import { getSigner } from '../Slice/ProviderSlice';


const GetAccount =async () => {
  

  const account= await window.ethereum.request({ method: 'eth_requestAccounts' })
 
  return account;
}

export default GetAccount