import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TradeOrders } from '../hooks/SelectOrderData';
import Banner from './Banner';

const Trade = () => {
    const dispatch = useDispatch();

    const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)
    const TradeData = useSelector((state) => state?.exchange?.TradeData)
    const token_contract = useSelector((state) => state?.token?.token_contract)
    const chainId = useSelector((state) => state?.provider?.chainId)
  

    useEffect(() => {
        TradeOrders(allFilledOrders, token_contract, chainId, dispatch);
    }, [allFilledOrders])
    return (
        <div className="component exchange__trades">
            <div className='component__header flex-between'>
                <h2>Trades</h2>
            </div>


            {!TradeData || TradeData.lenght == 0 ? (
                <Banner text='No Transactions' />
            ) : (<table>
                <thead>
                    <tr>
                        <th>Time<img src='./sort.svg' alt="Sort" /></th>
                        <th>{token_contract[0]?.symbol1}<img src='./sort.svg' alt="Sort" /></th>
                        <th>{token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}<img src='./sort.svg' alt="Sort" /></th>
                    </tr>
                </thead>
                <tbody>

                    {/* MAPPING OF ORDERS... */}

                    {TradeData && TradeData.map((order, index) => {
                        return (
                            <tr key={index}>
                                <td>{order?.formattedTimestamp}</td>
                                <td style={{ color: `${order.tokenPriceClass}` }}>{order.token0Amount}</td>
                                <td>{order.tokenPrice}</td>
                            </tr>
                        )
                    })}


                </tbody>
            </table>)}

        </div>
    );
}

export default Trade