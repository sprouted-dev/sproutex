import React from "react";
import Spinner from "./Spinner";
import {useDispatch, useSelector} from "react-redux";
import {selectGroupedOrderBook, selectOrderBookLoaded} from "../state/order-book.selectors";
import OrderTable from "./OrderTable";
import {selectWeb3Account} from "../state/web3.slice";
import {fillOrder, selectFillOrderPending} from "../state/filled-orders.slice";

const OrderBook = () => {
  const loaded = useSelector(selectOrderBookLoaded);
  const orderFillPending = useSelector(selectFillOrderPending)
  const account = useSelector(selectWeb3Account)
  const {buyOrders, sellOrders} = useSelector(selectGroupedOrderBook);
  const dispatch = useDispatch();

  const handleFillOrder = order => {
    dispatch(fillOrder({order, account}))
  }

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Order Book
      </div>
      <div className="card-body">
        { (loaded && !orderFillPending) ? (
          <table className="table table-dark table-sm small">
            <tbody>
            <OrderTable orders={sellOrders} fillOrder={handleFillOrder} />
            <tr>
              <th>SPROUT</th>
              <th>SPROUT/ETH</th>
              <th>ETH</th>
            </tr>
            <OrderTable orders={buyOrders} fillOrder={handleFillOrder} />
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