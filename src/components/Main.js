import React, {useEffect} from "react";
import {selectExchangeLoaded} from "../state/exchange.slice";
import {connect} from "react-redux";
import {fetchOrders} from "../state/orders.slice";
import {fetchCancelledOrders} from "../state/cancelled-orders.slice";
import {fetchFilledOrders} from "../state/filled-orders.slice";
import Trades from "./Trades";
import OrderBook from "./OrderBook";
import MyTransactions from "./MyTransactions";
import PriceChart from "./PriceChart";

const Main = ({ exchangeLoaded, fetchOrders, fetchCancelledOrders, fetchFilledOrders }) => {

  useEffect(() => {
    const loadOrderData = async () => {
      await Promise.all([fetchOrders(), fetchCancelledOrders(), fetchFilledOrders()])
    }
    if (exchangeLoaded) {
      loadOrderData();
    }
  }, [exchangeLoaded, fetchOrders, fetchCancelledOrders, fetchFilledOrders])

  return (
      <div className="content">
        <div className="vertical-split">
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
        <div className="vertical">
          <OrderBook />
        </div>
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <div className="vertical">
          <Trades />
        </div>
      </div>
  )
}

const mapStateToProps = state => ({
  exchangeLoaded: selectExchangeLoaded(state)
})

export default connect(mapStateToProps, {fetchOrders, fetchCancelledOrders, fetchFilledOrders})(Main);