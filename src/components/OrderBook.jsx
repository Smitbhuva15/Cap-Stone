import React from 'react'
import { useSelector } from 'react-redux';

const OrderBook = () => {

     const orders = useSelector((state) => state?.exchange?.allOrders)
     console.log(orders)
    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">


                <table className='exchange__orderbook--sell'>
                    <caption>Selling</caption>
                    <thead>
                        <tr>
                            <th> </th>
                            <th> </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* MAPPING OF SELL ORDERS... */}



                        <tr >
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>


                    </tbody>
                </table>


                <div className='divider'></div>


                <table className='exchange__orderbook--buy'>
                    <caption>Buying</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th> </th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* MAPPING OF BUY ORDERS... */}



                        <tr >
                            <td></td>
                            <td ></td>
                            <td></td>
                        </tr>


                    </tbody>
                </table>


            </div>
        </div>
    );
}

export default OrderBook