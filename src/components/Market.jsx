import config from '../config.json'
import { useDispatch, useSelector } from 'react-redux'
import { loadcontract } from '../hooks/LoadData'

const Market = () => {
    const chainId = useSelector((state) => state?.provider?.chainId)
    const provider = useSelector((state) => state?.provider?.providerconnection)
    const token_contract = useSelector((state) => state?.token?.token_contract)
    


    const dispatch=useDispatch();

    const marketHandler = (e) => {
        const value = e.target.value; 
        const addresses = value.split(",").map(addr => addr.trim());
        loadcontract(dispatch,addresses,provider)
    }
    const value1 = [config[chainId]?.CAP?.address, config[chainId]?.mETH?.address]
    const value2 = [config[chainId]?.CAP?.address, config[chainId]?.mDAI?.address]

    return (
        <div className='component exchange__markets'>
            <div className='component__header'>
                <h2>Select Market</h2>
            </div>

            {
                chainId && config[chainId] ? (
                    <select name="markets" id="markets" onChange={marketHandler}>
                        <option value={value1}>DApp / mETH</option>
                        <option value={value2}>DApp / mDAI</option>
                    </select>
                ) : (
                    <p>Not Deployed to Network</p>
                )
            }

            <hr />
        </div>
    )
}

export default Market
