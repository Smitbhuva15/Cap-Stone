import React from 'react'
import { useSelector } from 'react-redux'
import Banner from '../components/Banner'
import Chart from 'react-apexcharts';
import {series,options} from './PriceChart.config'

const PriceChart = () => {
      const account = useSelector((state) => state?.provider?.signer)
      const token_contract = useSelector((state) => state?.token?.token_contract)
    return (
        <div className="component exchange__chart">
            <div className='component__header flex-between'>
                <div className='flex'>

                <h2>{`${token_contract[0]?.symbol1}/${token_contract[0]?.symbol2}`}</h2>

                     <div className='flex'>
                        <span className='up'></span>
                     </div>

                </div>
            </div>

            {
                !account?
                (<Banner text={'Please Connect with Metamask'}/>)
                :
                (
                    <Chart 
                    type='candlestick'
                     series={series}
                    options={options}
                    height="100%"
                    width="100%"
                   

                    />
                )
            }

        </div>
    )
}

export default PriceChart