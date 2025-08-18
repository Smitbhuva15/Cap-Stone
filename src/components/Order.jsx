import React, { useState } from 'react'
import { loadAllOrder, makeorder } from '../hooks/LoadData';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Order = () => {
    const dispatch = useDispatch();

    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [isBuy, setIsBuy] = useState(true);
    const account = useSelector((state) => state?.provider?.signer)
    const token_contract = useSelector((state) => state?.token?.token_contract)
    const exchange = useSelector((state) => state?.exchange?.Exchange_contract)
    const providerconnection = useSelector((state) => state?.provider?.providerconnection)
    const ExchangeCAP_Balance = useSelector((state) => state?.exchange?.ExchangeCAP_Balance)
    const ExchangemEth_Balance = useSelector((state) => state?.exchange?.ExchangemEth_Balance)
    const ExchangemDai_Balance = useSelector((state) => state?.exchange?.ExchangemDai_Balance)
    const chainId = useSelector((state) => state?.provider?.chainId)

    const handelBuy = async (e) => {
        e.preventDefault();

        if (amount == 0 || price == 0) {
            toast.error("Please enter Valid number!!");
            return;
        }
        await makeorder(dispatch, token_contract, { amount, price }, providerconnection, exchange, 'Buy', account, ExchangeCAP_Balance, ExchangemEth_Balance, ExchangemDai_Balance, chainId)
        setAmount(0);
        setPrice(0);
        await loadAllOrder(dispatch, providerconnection, exchange)
    }

    const handelSell = async (e) => {
        e.preventDefault();

        if (amount === 0 || price === 0) {
            toast.error("Please enter Valid number!!");
            return;
        }
        await makeorder(dispatch, token_contract, { amount, price }, providerconnection, exchange, 'Sell', account, ExchangeCAP_Balance, ExchangemEth_Balance, ExchangemDai_Balance, chainId)
        setAmount(0);
        setPrice(0);
        await loadAllOrder(dispatch, providerconnection, exchange)
    }
    return (

        <div className="component exchange__orders">
            <div className='component__header flex-between'>
                <h2 className='font-bold!'>New Order</h2>
                <div className='tabs'>
                    <button className={`tab ${isBuy ? 'tab--active' : ""} sm:w-[50px]! sm:text-lg! w-[30px]! text-xs!`} onClick={() => { setIsBuy(true) }}>Buy</button>
                    <button className={`tab ${!isBuy ? 'tab--active' : ""} sm:w-[50px]! sm:text-lg! w-[30px]! text-xs!`} onClick={() => { setIsBuy(false) }}>Sell</button>
                </div>
            </div>

            <form onSubmit={isBuy ? (e) => { handelBuy(e) } : (e) => { handelSell(e) }}>

                {
                    isBuy
                        ?
                        (<label htmlFor="amount">Buy Amount</label>)
                        :
                        (<label htmlFor="amount">Sell Amount</label>)
                }


                <input
                    type="text"
                    id='amount'
                    placeholder='0.0000'
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => { setAmount(e.target.value) }}
                />

                {
                    isBuy
                        ?
                        (<label htmlFor="price">Buy Price</label>)
                        :
                        (<label htmlFor="price">Sell Price</label>
                        )
                }


                <input
                    type="text"
                    id='price'
                    placeholder='0.0000'
                    value={price === 0 ? '' : price}
                    onChange={(e) => { setPrice(e.target.value) }}
                />

                <button className='button button--filled' type='submit'>
                    {
                        isBuy
                            ?
                            (<span>Buy</span>)
                            :
                            (<span>Sell</span>)
                    }

                </button>
            </form>
        </div>
    );
}

export default Order