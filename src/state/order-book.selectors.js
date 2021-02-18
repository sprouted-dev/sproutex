import {createSelector} from "reselect";
import {selectFilledOrderIds, selectFilledOrdersLoading} from "./filled-orders.slice";
import {
  selectCancelledOrderIds,
  selectCancelledOrdersLoading
} from "./cancelled-orders.slice";
import {selectAllOrders, selectAllOrdersLoading} from "./orders.slice";
import {ETHER_ADDRESS, GREEN, RED} from "../helpers";
import {decorateOrder} from "../utils/order.util";

export const selectOrderBookLoaded = createSelector(
  selectFilledOrdersLoading,
  selectCancelledOrdersLoading,
  selectAllOrdersLoading,
  (filledLoading, cancelledLoading, ordersLoading) => (!filledLoading && !cancelledLoading && !ordersLoading)
)

export const selectOpenOrders = createSelector(
  selectAllOrders,
  selectCancelledOrderIds,
  selectFilledOrderIds,
  (orders, cancelled, filled) => {
    return orders.filter(o => !(cancelled.includes(o.id) || filled.includes(o.id)))
  }
)

export const selectDecoratedOpenOrders = createSelector(
  selectOpenOrders,
  openOrders => openOrders.map(order => {
    const o = decorateOrder(order)
    const orderType = o.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return ({
      ...o,
      orderType,
      orderTypeClass: (orderType === 'buy' ? GREEN : RED),
      orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
    })
  })
)

export const selectBuyOrders = createSelector(
  selectDecoratedOpenOrders,
  orders => getSortedOrdersForType(orders, 'buy')
)

export const selectSellOrders = createSelector(
  selectDecoratedOpenOrders,
  orders => getSortedOrdersForType(orders, 'sell')
)

export const selectGroupedOrderBook = createSelector(
  selectBuyOrders,
  selectSellOrders,
  (buyOrders, sellOrders) => ({ buyOrders, sellOrders})
)

const getSortedOrdersForType = (orders, orderType) => orders.filter(o => o.orderType === orderType)
  .sort( (a,b) => b.tokenPrice - a.tokenPrice)