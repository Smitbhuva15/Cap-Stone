import { createThirdwebClient } from "thirdweb";
import { ConnectButton} from "thirdweb/react";
import { mainnet, sepolia } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";



const client = createThirdwebClient({ clientId: import.meta.env.VITE_CLIENT_ID });

const Navbar = () => {


    return (
        <div className='exchange__header grid '>
            <div className='exchange__header--brand flex'>
                <img src='./cap3.png' className='logo ' alt="Cap Logo" />
                <h1 className='title '>Cap<span className=' logox'>X</span>change</h1>
            </div>

            {/* <div className='exchange__header--networks flex'>
                <img src='./eth.svg' alt="ETH Logo" className='Eth Logo' />

                chainId && (
                    <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : `0`} onChange={networkHandler} className=''>
                        <option value="0" disabled>Select Network</option>
                        <option value="0xaa36a7">Sepolia</option>
                        <option value="0x4268">Holesky</option>

                    </select>
                )
            </div> */}

            <div className='exchange__header--account justify-end flex  '>
                <ConnectButton
                    client={client}
                    wallets={[
                        createWallet("io.metamask"),
                        createWallet("com.coinbase.wallet"),
                        createWallet("me.rainbow"),
                    ]}
                     chains={[sepolia, mainnet]}
                />

            </div>
        </div>
    )
}

export default Navbar