import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import MyTradeTable from "./MyTradeTable";
import {useSelector} from "react-redux";
import {selectMyDecoratedTrades, selectMyOpenDecoratedOrders, selectMyOrdersLoading} from "../state/my-transactions.selectors";
import MyOrderTable from "./MyOrderTable";

const MyTransactions = () => {
  const loading = useSelector(selectMyOrdersLoading);
  const myTrades = useSelector(selectMyDecoratedTrades);
  const myOrders = useSelector(selectMyOpenDecoratedOrders);

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
            <MyOrderTable orders={myOrders} loading={loading} />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTransactions;