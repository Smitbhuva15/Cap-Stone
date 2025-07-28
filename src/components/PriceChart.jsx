import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Banner from '../components/Banner'
import Chart from 'react-apexcharts';
import { options } from './PriceChart.config'
import { seriesChart } from '../hooks/SelectOrderData';

const PriceChart = () => {
    const dispatch = useDispatch();

    const account = useSelector((state) => state?.provider?.signer)
    const token_contract = useSelector((state) => state?.token?.token_contract)
    const allFilledOrders = useSelector((state) => state?.exchange?.allFilledOrders)
    const chainId = useSelector((state) => state?.provider?.chainId)
    const ChartData = useSelector((state) => state?.exchange?.seriesChartData)

    let clonedSeries = [];

    if (ChartData?.series) {
        clonedSeries = JSON.parse(JSON.stringify(ChartData.series));
    }

    useEffect(() => {
        seriesChart(dispatch, allFilledOrders, token_contract, chainId);
    }, [allFilledOrders])


    return (
        <div className="component exchange__chart">
            <div className='component__header flex-between'>
                <div className='flex'>

                    <h2>{`${token_contract[0]?.symbol1}/${token_contract[0]?.symbol2}`}</h2>

                 {ChartData && (

            <div className='flex'>

              {ChartData?.lastorderSign === '+' ? (
                <img src='./up-arrow.svg' alt="Arrow up" />
              ): (
                <img src='./down-arrow.svg' alt="Arrow down" />
              )}

              <span className='up'>{ChartData?.lastOrderPrice}</span>
            </div>

          )}

                </div>
            </div>

            {
                !account ?
                    (<Banner text={'Please Connect with Metamask'} />)
                    :
                    (
                        <Chart
                            type='candlestick'
                            series={clonedSeries}
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