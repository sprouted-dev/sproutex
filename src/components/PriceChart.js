import React from "react";
import Chart from "react-apexcharts";
import {chartOptions} from "./PriceChartConfig";
import {useSelector} from "react-redux";
import {selectPriceChart, selectPriceChartLoading} from "../state/price-chart.selectors";
import Spinner from "./Spinner";

const PriceChart = () => {

  const loading = useSelector(selectPriceChartLoading);
  const priceChart = useSelector(selectPriceChart)

  const getPriceSymbol = (lastPriceChange) => lastPriceChange === '+' ? (
    <span className="text-success">&#9650;</span>
  ) : (
    <span className="text-danger">&#9660;</span>
  )

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Price Chart
      </div>
      <div className="card-body">
        { loading ?
          <Spinner /> :
          <div className="price-chart">
            <div className="price">
              <h4>SPROUT/ETH &nbsp; {getPriceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={priceChart.series} type="candlestick" width="100%" height="100%"/>
          </div>
        }

      </div>
    </div>
  )
}

export default PriceChart;