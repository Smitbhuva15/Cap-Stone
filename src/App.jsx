
import { useEffect } from 'react'
import './App.css'
import { ethers } from 'ethers'
import config from './config.json'
import TokenAbi from './abis/TokenAbi.json'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenContract } from './Slice/TokenSlice'
import { loadAccount, loadChainId, loadcontract, loadExhange, loadProvider } from './hooks/LoadData'
import Navbar from './components/Navbar'




function App() {

  const dispatch = useDispatch();

  const loadBlockchain = async () => {

    
    const provider = await loadProvider(dispatch);

    const chainId = await loadChainId(dispatch, provider);
    const account = await loadAccount(dispatch,provider);

    // console.log(contractaddress)
    const CAPaddress=config[chainId].CAP.address;
    const mEthaddress=config[chainId].mETH.address;

    const exchangeAddress=config[chainId].exchange.address;
   await loadcontract (dispatch,[CAPaddress,mEthaddress],provider)
   await loadExhange(dispatch, exchangeAddress,provider)

  }

  useEffect(() => {
    loadBlockchain();
  }, [])

  return (
    <div>
      <Navbar />

         <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

    </div>
  )
}

export default App
