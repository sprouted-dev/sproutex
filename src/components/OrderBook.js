import React from "react";
import Spinner from "./Spinner";
import {useSelector} from "react-redux";
import {selectGroupedOrderBook, selectOrderBookLoaded} from "../state/order-book.selectors";
import OrderTable from "./OrderTable";

const OrderBook = () => {
  const loaded = useSelector(selectOrderBookLoaded);
  const {buyOrders, sellOrders} = useSelector(selectGroupedOrderBook);

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Order Book
      </div>
      <div className="card-body">
        { loaded ? (
          <table className="table table-dark table-sm small">
            <tbody>
            <OrderTable orders={sellOrders} />
            <tr>
              <th>SPROUT</th>
              <th>SPROUT/ETH</th>
              <th>ETH</th>
            </tr>
            <OrderTable orders={buyOrders} />
            </tbody>
          </table>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}

export default OrderBook;