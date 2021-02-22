import React from "react";
import Spinner from "../components/Spinner";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';

const MyOrderTable = ({orders, loading, cancelOrder}) => {

  const handleCancelClick = (order) => {
    cancelOrder({order})
  }

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
          <td className="text-muted cancel-order">
            <FontAwesomeIcon icon={faTimesCircle}
                             onClick={(e) => handleCancelClick(order)} />
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default MyOrderTable;