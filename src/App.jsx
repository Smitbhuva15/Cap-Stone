
import { useEffect } from 'react'
import './App.css'
import config from './config.json'
import { useDispatch } from 'react-redux'
import { loadAccount, loadChainId, loadcontract, loadExhange, loadProvider } from './hooks/LoadData'
import Navbar from './components/Navbar'
import Market from './components/Market'
import Balance from './components/Balance'




function App() {

  const dispatch = useDispatch();

  const loadBlockchain = async () => {

    //connect ethers to blockchain
    const provider = await loadProvider(dispatch);

    //fetch current netwotk chainid
    const chainId = await loadChainId(dispatch, provider);

    //reload the page when chainid is change
    window.ethereum.on('chainChanged',()=>{
      window.location.reload();
    })

    //fetch current account and balance from metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(dispatch, provider);
    })



    const CAPaddress = config[chainId].CAP.address;
    const mEthaddress = config[chainId].mETH.address;


    const exchangeAddress = config[chainId].exchange.address;
    // load token contract
    await loadcontract(dispatch, [CAPaddress, mEthaddress], provider)
    //load exchange contract
    await loadExhange(dispatch, exchangeAddress, provider)

  }

  useEffect(() => {
    loadBlockchain();
  }, [])

  return (
    <div>
      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

         <Market />

          <Balance />

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
