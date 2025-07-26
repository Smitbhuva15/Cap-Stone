import React, { useState } from 'react'

const Order = () => {
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [isBuy, setIsBuy] = useState(true);

    const handelBuy = (e) => {
        e.preventDefault();
        console.log("buy")
    }

    const handelSell = (e) => {
        e.preventDefault();
        console.log("sell")
    }
    return (

        
        <div className="component exchange__orders">
            <div className='component__header flex-between'>
                <h2>New Order</h2>
                <div className='tabs'>
                    <button className={`tab ${isBuy ? 'tab--active' : ""}`} onClick={() => { setIsBuy(true) }}>Buy</button>
                    <button className={`tab ${!isBuy ? 'tab--active' : ""}`} onClick={() => { setIsBuy(false) }}>Sell</button>
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