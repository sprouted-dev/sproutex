import React from "react";
import Chart from "react-apexcharts";
import {chartOptions, dummyData} from "./PriceChartConfig";
import {useSelector} from "react-redux";
import {selectPriceChartLoading} from "../state/price-chart.selectors";
import Spinner from "./Spinner";

const PriceChart = () => {

  const loading = useSelector(selectPriceChartLoading);

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Price Chart
      </div>
      <div className="card-body">
        { loading ?
          <Spinner /> :
          <Chart options={chartOptions} series={dummyData} type="candlestick" width="100%" height="100%"/>
        }

      </div>
    </div>
  )
}

export default PriceChart;