import React from "react";
import Spinner from "./Spinner";

const MyOrderTable = ({orders, loading}) => {

  return loading ? (
    <Spinner />
  ):(
    <table className="table table-dark table-sm small">
      <thead>
      <tr>
        <th>Amount</th>
        <th>SPROUT/ETH</th>
        <th>Cancel</th>
      </tr>
      </thead>
      <tbody>
      { orders.map(order => (
        <tr key={order.id} className={`order-${order.id}`}>
          <td className={`text-${order.orderTypeClass}`}>{order.sproutAmount}</td>
          <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          <td className="text-muted">x</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default MyOrderTable;