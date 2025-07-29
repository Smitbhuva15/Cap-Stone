import { useDispatch, useSelector } from 'react-redux'
import Blockies from 'react-blockies'
import { loadAccount } from '../hooks/LoadData';
import config from '../config.json'


const Navbar = () => {

    const dispatch = useDispatch();
    const account = useSelector((state) => state?.provider?.signer)
    const balance = useSelector((state) => state?.provider?.balance)
    const chainId = useSelector((state) => state?.provider?.chainId)
    const provider = useSelector((state) => state?.provider?.providerconnection)

    const handelClick = async () => {
        const account = await loadAccount(dispatch, provider);
    }

    const networkHandler = async (e) => {
        // console.log(e.target.value
        // for call this method ---> hexadecimal chainid is require;
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: e.target.value }],
        })
    }

    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src='./logo.png' className='logo' alt="Cap Logo" />
                <h1>Cap Token Exchange</h1>
            </div>
            <div className='exchange__header--networks flex'>
                <img src='./eth.svg' alt="ETH Logo" className='Eth Logo' />

                {chainId && (
                    <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : `0`} onChange={networkHandler}>
                        <option value="0" disabled>Select Network</option>
                        <option value="0x7A69">Localhost</option>
                        {/* <option value="0x2a">Kovan</option> */}
                        <option value="0xaa36a7">Sepolia</option>
                        <option value="0x4268">Holesky</option>

                    </select>
                )}
            </div>

            <div className='exchange__header--account flex'>
                {
                    balance ? (
                        <p><small>My Balance</small>{Number(balance).toFixed(4)}</p>
                    )
                        : (
                            <p><small>My Balance</small>0 ETH</p>
                        )
                }

                {
                    account ? (
                        <a
                            href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : `#`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            {account.slice(0, 5) + "..." + account.slice(38, 42)}
                            <Blockies
                                seed={account}
                                size={10}
                                scale={3}
                                color="#2187D0"
                                bgColor="#F1F2F9"
                                spotColor="#767F92"
                                className="identicon"
                            />
                        </a>

                    )
                        : (
                            <button className='button' onClick={handelClick}>Connect</button>
                        )
                }

            </div>
        </div>
    )
}

export default Navbar