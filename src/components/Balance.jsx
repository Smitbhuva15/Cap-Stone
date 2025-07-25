import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadbalance, transferTokens } from '../hooks/LoadData';

const Balance = () => {

    const dispatch = useDispatch();
    const [token1Tranfer, setToken1Transfer] = useState(0);

    const token_contract = useSelector((state) => state?.token?.token_contract)
    const exchange = useSelector((state) => state?.exchange?.Exchange_contract)
    const account = useSelector((state) => state?.provider?.signer)
    const chainId = useSelector((state) => state?.provider?.chainId)

    const providerconnection = useSelector((state) => state.provider.providerconnection)


    const tokenCAP_Balance = useSelector((state) => state?.token?.tokenCAP_Balance)
    const ExchangeCAP_Balance = useSelector((state) => state?.exchange?.ExchangeCAP_Balance)

    const handelsubmit = (e, tokenAddress) => {
        e.preventDefault();
        if (tokenAddress == token_contract[0].contract1.address) {
            transferTokens(dispatch, token_contract[0].contract1, token1Tranfer, providerconnection, exchange, account)
        }
    }

    useEffect(() => {
        if (token_contract && exchange && account) {
            loadbalance(dispatch, token_contract, exchange, account, chainId)
        }
    }, [account, token_contract, exchange, chainId])


    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button className='tab tab--active'>Deposit</button>
                    <button className='tab'>Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (CAP) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src='./dapp.svg' alt="Token Logo" />{token_contract[0]?.symbol1}</p>
                    <p><small>Wallet</small><br />{tokenCAP_Balance}</p>
                    <p><small>Exchange</small><br />{ExchangeCAP_Balance}</p>
                </div>

                <form onSubmit={(e) => handelsubmit(e, token_contract[0].contract1.address)}>
                    <label htmlFor="token1"></label>
                    <input type="text" id='token1' placeholder='0.0000'
                        onChange={(e) => { setToken1Transfer(e.target.value) }} />

                    <button className='button' type='submit'>
                        <span>Deposite</span>
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    {token_contract[0]?.symbol2}
                </div>

                <form>
                    <label htmlFor="token1"></label>
                    <input type="text" id='token1' placeholder='0.0000' />

                    <button className='button' type='submit'>
                        <span></span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}


export default Balance