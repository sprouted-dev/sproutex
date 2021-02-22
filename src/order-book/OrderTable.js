import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const OrderTable = ({orders, fillOrder}) => {

  const handleRowClick = order => {
    fillOrder(order);
  }
  return (
    orders.map(order => (
      <OverlayTrigger key={order.id}
                      placement="auto"
                      overlay={
                        <Tooltip id={order.id}>{`Click her to ${order.orderFillAction}`}</Tooltip>
                      }>
        <tr key={order.id}
            className="order-book-order"
            onClick={(e) => handleRowClick(order)}>
          <td>{order.sproutAmount}</td>
          <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          <td>{order.etherAmount}</td>
        </tr>
      </OverlayTrigger>
    ))
  )
}

export default OrderTable;