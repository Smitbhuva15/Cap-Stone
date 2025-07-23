import {ethers} from 'ethers'


const GetProvider = () => {
 const provider=new ethers.providers.Web3Provider(window.ethereum);
 return provider;
}

export default GetProvider