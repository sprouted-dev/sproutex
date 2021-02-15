import React from "react";
import Spinner from "./Spinner";

const TradeTable = ({trades, loading}) => {

  return loading ? (
    <Spinner />
  ):(
    <table className="table table-dark table-sm small">
      <thead>
      <tr>
        <th>Time</th>
        <th>SPROUT</th>
        <th>SPROUT/ETH</th>
      </tr>
      </thead>
      <tbody>
      { trades.map(trade => (
        <tr key={trade.id} className={`order-${trade.id}`}>
          <td className={`text-muted`}>{trade.createdAt}</td>
          <td>{trade.sproutAmount}</td>
          <td className={`text-${trade.sproutPriceClass}`}>{trade.tokenPrice}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default TradeTable;