import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { myTradeOrder, MyTransactionData } from '../hooks/SelectOrderData';
import Banner from './Banner';
import { cancelOrder, loadAllOrder } from '../hooks/LoadData';

const MyTransaction = () => {

  const dispatch = useDispatch();
  const [isTransaction, setIsTransaction] = useState(true);


  const token_contract = useSelector((state) => state?.token?.token_contract)
  const Allorders = useSelector((state) => state?.exchange?.allOrders)
  const allCancelOrders = useSelector((state) => state?.exchange?.allCancelOrders)
  const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)
  const account = useSelector((state) => state?.provider?.signer)
  const chainId = useSelector((state) => state?.provider?.chainId)
  const provider = useSelector((state) => state?.provider?.providerconnection)
  const exchange = useSelector((state) => state?.exchange?.Exchange_contract)




  const Mytransactions = useSelector((state) => state?.exchange?.Mytransactions)
  const MyTradeData = useSelector((state) => state?.exchange?.MyTradeData)

  


  useEffect(() => {
    MyTransactionData(dispatch, token_contract, Allorders, allCancelOrders, allFilledOrders, account, chainId)
    myTradeOrder(dispatch, allFilledOrders, token_contract, chainId,account)
  }, [token_contract, Allorders, allCancelOrders, allFilledOrders, account, chainId]);

  const handelCancelOrder = async (order) => {
    await cancelOrder(order, exchange, provider);

    await loadAllOrder(dispatch, provider, exchange)
  }

  return (
  <div className="component exchange__transactions">
    {isTransaction ? (
      <div>
        <div className="component__header flex-between">
          <h2  className='font-bold!'>My Orders</h2>
          <div className="tabs ">
            <button
              className={`tab ${isTransaction ? 'tab--active' : ''} sm:w-[50px]! sm:text-md! w-[30px]! text-xs!`}
              onClick={() => setIsTransaction(true)}
              
            >
              Orders
            </button>
            <button
              className={`tab ${!isTransaction ? 'tab--active' : ''} sm:w-[50px]! sm:text-md! w-[30px]! text-xs!`}
              onClick={() => setIsTransaction(false)}
            >
              Trades
            </button>
          </div>
        </div>

        {!Mytransactions || Mytransactions.length === 0 ? (
          <Banner text="No Open Orders" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  {token_contract[0]?.symbol1}
                  <img src="./sort.svg" alt="Sort" className='md:block! hidden!'/>
                </th>
                <th>
                  {token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}
                  <img src="./sort.svg" alt="Sort" className='md:block! hidden!'/>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Mytransactions.map((order, index) => (
                <tr key={index}>
                  <td style={{ color: order.tokenPriceclass }}>
                    {order.token0Amount}
                  </td>
                  <td>{order.tokenPrice}</td>
                  <td>
                    <button
                      className="button--sm sm:text-sm text-xs!"
                      onClick={() => handelCancelOrder(order)}
                      
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    ) : (
      <div>
        <div className="component__header flex-between">
          <h2 className='font-bold!'>My Transactions</h2>
          <div className="tabs">
            <button
              className={`tab ${isTransaction ? 'tab--active' : ''}  sm:w-[50px]! sm:text-md! w-[30px]! text-xs!`}
              onClick={() => setIsTransaction(true)}
            >
              Orders
            </button>
            <button
              className={`tab ${!isTransaction ? 'tab--active' : ''}  sm:w-[50px]! sm:text-md! w-[30px]! text-xs!`}
              onClick={() => setIsTransaction(false)}
            >
              Trades
            </button>
          </div>
        </div>

        {!MyTradeData || MyTradeData.length === 0 ? (
          <Banner text="No Trades Orders" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  Time
                  <img src="./sort.svg" alt="Sort" className='md:block! hidden!'/>
                </th>
                <th>
                  {token_contract[0]?.symbol1}
                  <img src="./sort.svg" alt="Sort" className='md:block! hidden!'/>
                </th>
                <th>
                  {token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}
                  <img src="./sort.svg" alt="Sort" className='md:block! hidden!'/>
                </th>
              </tr>
            </thead>
            <tbody>
              {MyTradeData.map((order, index) => (
                <tr key={index}>
                  <td>{order.formattedTimestamp}</td>
                  <td style={{ color: order.orderClass }}>
                    {order.orderSign}
                    {order.token0Amount}
                  </td>
                  <td>{order.tokenPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </div>
);

}

export default MyTransaction