
import { useEffect } from 'react'
import './App.css'
import config from './config.json'
import { useDispatch } from 'react-redux'
import { loadAllOrder, loadChainId, loadcontract, loadExhange, loadProvider } from './hooks/LoadData'
import Navbar from './components/Navbar'
import Market from './components/Market'
import Balance from './components/Balance'
import { Toaster } from 'react-hot-toast';
import Order from './components/Order'
import OrderBook from './components/OrderBook'
import PriceChart from './components/PriceChart'
import MyTransaction from './components/MyTransaction'
import Trade from './components/Trade'
import Footer from './components/Footer'
import Banner2 from './components/Banner2'
import { useActiveAccount } from 'thirdweb/react'




function App() {

  const dispatch = useDispatch();
  const Account = useActiveAccount();
  const account = Account?.address;


  const loadBlockchain = async () => {

    //connect ethers to blockchain
    const provider = await loadProvider(dispatch);

    //fetch current netwotk chainid
    const chainId = await loadChainId(dispatch, provider);

    //reload the page when chainid is change
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })

    const CAPaddress = config[chainId].CAP.address;
    const mEthaddress = config[chainId].mETH.address;


    const exchangeAddress = config[chainId].exchange.address;
    // load token contract
    await loadcontract(dispatch, [CAPaddress, mEthaddress], provider)
    //load exchange contract
    const exchange = await loadExhange(dispatch, exchangeAddress, provider)

    // load all Orders

    await loadAllOrder(dispatch, provider, exchange)



  }

  useEffect(() => {
    loadBlockchain();
  }, [])

  return (
    <div className=''>
      <Navbar />
      {
        account ? (
          <main className='exchange bg-[#0D121D]!'>


            <section className='exchange__section--left grid max-w-7xl! mx-auto! '>


              <Market />

              <Balance />

              <Order />

            </section>


            <section className='exchange__section--right grid max-w-7xl! mx-auto!'>

              <PriceChart />

              <MyTransaction />

              <Trade />

              <OrderBook />



            </section>

          </main>
        ) : (
          <div className='bg-black'>
            <Banner2
              title={'Connect Your Wallet'}
              model={''}

            />
          </div>

        )
      }

      <div className='bg-[#121A29]'>
        <Footer />

      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
