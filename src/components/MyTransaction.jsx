import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyTransactionData } from '../hooks/SelectOrderData';
import Banner from './Banner';
import { cancelOrder, loadAllOrder } from '../hooks/LoadData';

const MyTransaction = () => {

  const dispatch = useDispatch();

  const token_contract = useSelector((state) => state?.token?.token_contract)
  const Allorders = useSelector((state) => state?.exchange?.allOrders)
  const allCancelOrders = useSelector((state) => state?.exchange?.allCancelOrders)
  const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)
  const account = useSelector((state) => state?.provider?.signer)
  const chainId = useSelector((state) => state?.provider?.chainId)
  const provider = useSelector((state) => state?.provider?.providerconnection)
  const exchange = useSelector((state) => state?.exchange?.Exchange_contract)




  const Mytransactions = useSelector((state) => state?.exchange?.Mytransactions)


  useEffect(() => {
    MyTransactionData(dispatch, token_contract, Allorders, allCancelOrders, allFilledOrders, account, chainId)
  }, [token_contract, Allorders, allCancelOrders, allFilledOrders, account, chainId]);

  const handelCancelOrder = async (order) => {
    await cancelOrder(order, exchange, provider);

    await loadAllOrder(dispatch, provider, exchange)
  }

  return (
    <div className="component exchange__transactions">
      <div>
        <div className='component__header flex-between'>
          <h2>My Orders</h2>

          <div className='tabs'>
            <button className='tab tab--active'>Orders</button>
            <button className='tab'>Trades</button>
          </div>
        </div>


        {!Mytransactions || Mytransactions.length == 0 ? (
          <Banner
            text='No Open Orders'
          />
        ) :
          (<table>
            <thead>
              <tr>
                <th>{token_contract[0]?.symbol1}<img src='./sort.svg' alt="Sort" /></th>
                <th>{token_contract[0]?.symbol1}/{token_contract[0]?.symbol2}<img src='./sort.svg' alt="Sort" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>

              {Mytransactions && Mytransactions.map((order, index) => {
                return (
                  <tr key={index}>
                    <td style={{ color: `${order.tokenPriceclass}` }}>{order.token0Amount}</td>
                    <td>{order.tokenPrice}</td>
                    <td><button className='button--sm' onClick={() => handelCancelOrder(order)}>Cancel</button></td>
                  </tr>
                )
              })}

            </tbody>
          </table>


          )
        }
      </div>


    </div>
  )
}

export default MyTransaction