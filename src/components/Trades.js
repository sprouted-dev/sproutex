import React from "react";
import {useSelector} from "react-redux";
import {selectDecoratedTrades, selectFilledOrdersLoading} from "../state/filled-orders.slice";
import TradeTable from "./TradeTable";

const Trades = () => {
  const loading = useSelector(selectFilledOrdersLoading);
  const trades = useSelector(selectDecoratedTrades);

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Trades
      </div>
      <div className="card-body">
        <TradeTable trades={trades} loading={loading} />
      </div>
    </div>
  )
}

export default Trades;