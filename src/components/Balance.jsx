import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadbalance, transferTokens } from '../hooks/LoadData';

const Balance = () => {

    const dispatch = useDispatch();
    const [token1Tranfer, setToken1Transfer] = useState(0);
    const [token2Tranfer, setToken2Transfer] = useState(0);
    const [isDeposit, setIsDeposit] = useState(true);

    const token_contract = useSelector((state) => state?.token?.token_contract)
    const exchange = useSelector((state) => state?.exchange?.Exchange_contract)
    const account = useSelector((state) => state?.provider?.signer)
    const chainId = useSelector((state) => state?.provider?.chainId)
    const event = useSelector((state) => state?.exchange?.event)

    const providerconnection = useSelector((state) => state?.provider?.providerconnection)


    const tokenCAP_Balance = useSelector((state) => state?.token?.tokenCAP_Balance)
    const ExchangeCAP_Balance = useSelector((state) => state?.exchange?.ExchangeCAP_Balance)
    const tokenmEth_Balance = useSelector((state) => state?.token?.tokenmEth_Balance)
    const ExchangemEth_Balance = useSelector((state) => state?.exchange?.ExchangemEth_Balance)
    const tokenmDai_Balance = useSelector((state) => state?.token?.tokenmDai_Balance)
    const ExchangemDai_Balance = useSelector((state) => state?.exchange?.ExchangemDai_Balance)

    const handelsubmit = (e, tokenAddress) => {
        e.preventDefault();
        if (tokenAddress == token_contract[0]?.contract1?.address) {
            transferTokens(dispatch, token_contract[0]?.contract1, token1Tranfer, providerconnection, exchange)
            setToken1Transfer(0);
        }
        else {
            transferTokens(dispatch, token_contract[0]?.contract2, token2Tranfer, providerconnection, exchange)
            setToken2Transfer(0);
        }

    }

    useEffect(() => {
        if (token_contract && exchange && account) {
            loadbalance(dispatch, token_contract, exchange, account, chainId)
        }
    }, [account, token_contract, exchange, chainId, event])


    return (

        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button className={`tab ${isDeposit ? 'tab--active' : ''}`} onClick={() => { setIsDeposit(true) }}>Deposit</button>
                    <button className={`tab ${!isDeposit ? 'tab--active' : ''}`} onClick={() => { setIsDeposit(false) }}>Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (CAP) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src='./dapp.svg' alt="Token Logo" />{token_contract[0]?.symbol1}</p>
                    <p><small>Wallet</small><br />{tokenCAP_Balance}</p>
                    <p><small>Exchange</small><br />{ExchangeCAP_Balance}</p>
                </div>

                <form onSubmit={(e) => handelsubmit(e, token_contract[0]?.contract1?.address)}>
                    <label htmlFor="1"></label>
                    <input
                        type="text"
                        id='token1'
                        placeholder='0.0000'
                        value={token1Tranfer === 0 ? '' : token1Tranfer}
                        onChange={(e) => { setToken1Transfer(e.target.value) }} />

                    <button className='button' type='submit'>
                        {isDeposit ? (
                            <span>Deposite</span>
                        )
                            : (
                                <span>WithDraw</span>
                            )}

                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <p><small>Token</small><br /><img src='./eth.svg' alt="Token Logo" />{token_contract[0]?.symbol2}</p>
                    <p><small>Wallet</small><br />{`${token_contract[0]?.symbol2 == 'mETH' ? tokenmEth_Balance : tokenmDai_Balance}`}</p>
                    <p><small>Exchange</small><br />{`${token_contract[0]?.symbol2 == 'mETH' ? ExchangemEth_Balance : ExchangemDai_Balance}`}</p>
                </div>

                <form onSubmit={(e) => { handelsubmit(e, token_contract[0]?.contract2?.address) }}>
                    <label htmlFor="token2"></label>
                    <input
                        type="text"
                        id='token2'
                        placeholder='0.0000'
                        value={token2Tranfer === 0 ? '' : token2Tranfer}
                        onChange={(e) => { setToken2Transfer(e.target.value) }}
                    />

                    <button className='button' type='submit'>
                        {isDeposit ? (
                            <span>Deposite</span>
                        )
                            : (
                                <span>WithDraw</span>
                            )}

                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}


export default Balance