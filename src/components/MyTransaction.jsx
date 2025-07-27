import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyTransactionData } from '../hooks/SelectOrderData';

const MyTransaction = () => {

   const dispatch = useDispatch();
  
    const token_contract = useSelector((state) => state?.token?.token_contract)
    const Allorders = useSelector((state) => state?.exchange?.allOrders)
    const allCancelOrders = useSelector((state) => state?.exchange?.allCancelOrders)
    const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)
    const account = useSelector((state) => state?.provider?.signer)
    const chainId = useSelector((state) => state?.provider?.chainId)


  const Mytransactions= useSelector((state) => state?.exchange?.Mytransactions)
 

  useEffect(()=>{
   MyTransactionData(dispatch, token_contract, Allorders, allCancelOrders, allFilledOrders, account,chainId)
  },[token_contract, Allorders,allCancelOrders, allFilledOrders ,account,chainId ]);
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

       
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>

           
                  <tr >
                    <td></td>
                   
                    <td></td>
                    <td></td>
                  </tr>
                

            </tbody>
          </table>
        



      </div>


    </div>
  )
}

export default MyTransaction