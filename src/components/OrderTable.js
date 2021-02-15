import React from "react";

const OrderTable = ({orders}) => {

  return (
    orders.map(order => (
      <tr key={order.id} className={`order-${order.id}`}>
        <td>{order.sproutAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    ))
  )
}

export default OrderTable;