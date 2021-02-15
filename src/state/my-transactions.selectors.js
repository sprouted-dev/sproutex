import {createSelector} from "reselect";
import {selectWeb3Account} from "./web3.slice";
import {selectDecoratedTrades, selectFilledOrdersLoading} from "./filled-orders.slice";
import {ETHER_ADDRESS, GREEN, RED} from "../helpers";
import {selectDecoratedOpenOrders} from "./order-book.selectors";

export const selectMyOrdersLoading = createSelector(
  selectFilledOrdersLoading,
  loading => loading
)

export const selectMyFilledOrders = createSelector(
  selectWeb3Account,
  selectDecoratedTrades,
  (account, orders) => orders.filter(o => o.user === account || o.userFill === account)
)

export const selectMyDecoratedTrades = createSelector(
  selectMyFilledOrders,
  selectWeb3Account,
  (trades, account) => trades.map((trade) => {
    const isMyOrder = trade.user === account;
    let orderType;
    if (isMyOrder) {
      orderType = trade.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    } else {
      orderType = trade.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
    }
    return ({
      ...trade,
      orderType,
      orderTypeClass: (orderType === 'buy' ? GREEN : RED),
      orderSign: (orderType === 'buy' ? '+' : '-')
    })
  })
)

export const selectMyOpenOrders = createSelector(
  selectWeb3Account,
  selectDecoratedOpenOrders,
  (account, orders) => orders.filter(order => order.user === account)
    .sort((a,b) => b.timestamp - a.timestamp)
)

export const selectMyOpenDecoratedOrders = createSelector(
  selectMyOpenOrders,
  orders => orders.map(order => {
    let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    return ({
      ...order,
      orderType,
      orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
  })
)