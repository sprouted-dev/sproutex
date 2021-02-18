import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import MyTradeTable from "./MyTradeTable";
import {useDispatch, useSelector} from "react-redux";
import {selectMyDecoratedTrades, selectMyOpenDecoratedOrders, selectMyOrdersLoading} from "../state/my-transactions.selectors";
import MyOrderTable from "./MyOrderTable";
import {selectWeb3Account} from "../state/web3.slice";
import {cancelOrder, selectCancelOrderPending} from "../state/cancelled-orders.slice";

const MyTransactions = () => {
  const loading = useSelector(selectMyOrdersLoading);
  const myTrades = useSelector(selectMyDecoratedTrades);
  const myOrders = useSelector(selectMyOpenDecoratedOrders);
  const dispatch = useDispatch();
  const account = useSelector(selectWeb3Account);
  const orderCancelling = useSelector(selectCancelOrderPending);

  const handleCancelOrder = ({order}) => {
    dispatch(cancelOrder({order, account}))
  }

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        My Transactions
      </div>
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="bg-dark text-white">
          <Tab eventKey="trades" title="Trades" className="bg-dark">
            <MyTradeTable trades={myTrades} loading={loading} />
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <MyOrderTable orders={myOrders} loading={loading || orderCancelling} cancelOrder={handleCancelOrder} />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTransactions;