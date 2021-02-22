import {createSelector} from "reselect";
import {selectDecoratedTrades, selectFilledOrdersLoading} from "../trades/filled-orders.slice";
import {getStartOfPeriod, groupBy, maxBy, minBy} from "../helpers";
export const selectPriceChartLoading = createSelector(
  selectFilledOrdersLoading,
  loading => loading
)

export const selectPriceChart = createSelector(
  selectDecoratedTrades,
  trades => {
    const [secondLastTrade, lastTrade] = trades.slice(trades.length - 2, trades.length);
    const lastPrice = lastTrade && lastTrade.tokenPrice ? lastTrade.tokenPrice : 0;
    const prevLastPrice = secondLastTrade && secondLastTrade.tokenPrice ? secondLastTrade.tokenPrice : 0;
    return ({
      lastPrice,
      lastPriceChange: (lastPrice >= prevLastPrice ? '+' : '-'),
      series: [{
        data: buildGraphData(trades)
      }]
    })
  }
)

const buildGraphData = (orders) => {
  const grouped = groupBy(orders, (o) => getStartOfPeriod(o.timestamp, 'hour'))
  const periods = Object.keys(grouped);

  return periods.map(p => {
    const group = grouped[p];

    return ({
      x: new Date(p),
      y: [
        group[0].tokenPrice,
        maxBy(group, 'tokenPrice'),
        minBy(group, 'tokenPrice'),
        group[group.length -1].tokenPrice
      ]
    })
  })
}
