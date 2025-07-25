import React from 'react'

const Order = () => {
    return (
        <div className="component exchange__orders">
            <div className='component__header flex-between'>
                <h2>New Order</h2>
                <div className='tabs'>
                    <button onClick={tabHandler} ref={buyRef} className='tab tab--active'>Buy</button>
                    <button onClick={tabHandler} ref={sellRef} className='tab'>Sell</button>
                </div>
            </div>

            <form onSubmit={isBuy ? buyHandler : sellHandler}>


                <label htmlFor="amount">Buy Amount</label>



                <input
                    type="text"
                    id='amount'
                    placeholder='0.0000'

                />


                <label htmlFor="price">Buy Price</label>


                <input
                    type="text"
                    id='price'
                    placeholder='0.0000'
                />

                <button className='button button--filled' type='submit'>

                </button>
            </form>
        </div>
    );
}

export default Order