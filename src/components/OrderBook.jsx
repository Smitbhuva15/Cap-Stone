
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react'
import SelectOrderData from '../hooks/SelectOrderData';

const OrderBook = () => {

    const dispatch = useDispatch();

    const orders = useSelector((state) => state?.exchange?.allOrders)
    const token_contract = useSelector((state) => state?.token?.token_contract)
    const chainId = useSelector((state) => state?.provider?.chainId)
    const buyOrder = useSelector((state) => state?.exchange?.buyorder)
    const sellOrder = useSelector((state) => state?.exchange?.sellorder)
    const allCancelOrders = useSelector((state) => state?.exchange?.allCancelOrders)
    const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)


    useEffect(() => {
        SelectOrderData(dispatch, token_contract, orders, allCancelOrders, allFilledOrders, chainId);
    }, [orders,allCancelOrders,allFilledOrders])


    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">
                {

                    !sellOrder || sellOrder?.length === 0 ? (
                        <p className="flex-center">No Sell Orders</p>
                    ) : (
                        <table className="exchange__orderbook--sell">
                            <caption>Selling</caption>
                            <thead>
                                <tr>
                                    <th>
                                        {token_contract[0]?.symbol1}
                                        <img src="./sort.svg" alt="Sort" />
                                    </th>
                                    <th>
                                        {token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}
                                        <img src="./sort.svg" alt="Sort" />
                                    </th>
                                    <th>
                                        {token_contract[0]?.symbol2}
                                        <img src="./sort.svg" alt="Sort" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sellOrder.map((order, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{order.token0Amount}</td>
                                                <td style={{ color: order.tokenPriceclass }}>{order.tokenPrice}</td>
                                                <td>{order.token1Amount}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>

                        </table>
                    )
                }



                <div className='divider'></div>

                {!buyOrder || buyOrder?.length === 0 ? (
                    <p className="flex-center">No Buy Orders</p>
                )
                    : (<table className='exchange__orderbook--buy'>
                        <caption>Buying</caption>
                        <thead>
                            <tr>
                                <th>
                                    {token_contract[0]?.symbol1}
                                    <img src="./sort.svg" alt="Sort" />
                                </th>
                                <th>
                                    {token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}
                                    <img src="./sort.svg" alt="Sort" />
                                </th>
                                <th>
                                    {token_contract[0]?.symbol2}
                                    <img src="./sort.svg" alt="Sort" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                buyOrder.map((order, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{order.token0Amount}</td>
                                            <td style={{ color: order.tokenPriceclass }}>{order.tokenPrice}</td>
                                            <td>{order.token1Amount}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    )}
            </div>
        </div>
    );
}

export default OrderBook