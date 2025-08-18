import config from '../config.json'
import { useDispatch, useSelector } from 'react-redux'
import { loadAllOrder, loadcontract } from '../hooks/LoadData'
import SelectOrderData, { TradeOrders } from '../hooks/SelectOrderData'
import { store } from '../store/store'

const Market = () => {
    const chainId = useSelector((state) => state?.provider?.chainId)
    const provider = useSelector((state) => state?.provider?.providerconnection)
    const Allorders = useSelector((state) => state?.exchange?.allOrders)
    const allCancelOrders = useSelector((state) => state?.exchange?.allCancelOrders)
    const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)

    const dispatch = useDispatch();

    const marketHandler = async (e) => {
        const value = e.target.value;
        const addresses = value.split(",").map(addr => addr.trim());
        await loadcontract(dispatch, addresses, provider)
        const updated_token_contract = store.getState().token.token_contract;
        SelectOrderData(dispatch, updated_token_contract, Allorders, allCancelOrders, allFilledOrders, chainId)
        TradeOrders(allFilledOrders, updated_token_contract, chainId, dispatch)
    }
    const value1 = [config[chainId]?.CAP?.address, config[chainId]?.mETH?.address]
    const value2 = [config[chainId]?.CAP?.address, config[chainId]?.mDAI?.address]

    return (
        <div className='component exchange__markets '>
            <div className='component__header'>
                <h2 className='market'>Select Market</h2>
            </div>

            {
                chainId && config[chainId] ? (
                    <select name="markets" id="markets" onChange={marketHandler}>
                        <option value={value1}>CAP / mETH</option>
                        <option value={value2}>CAP / mDAI</option>
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
