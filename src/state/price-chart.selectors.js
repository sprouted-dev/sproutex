import {createSelector} from "reselect";
import {selectDecoratedTrades, selectFilledOrdersLoading} from "./filled-orders.slice";

export const selectPriceChartLoading = createSelector(
  selectFilledOrdersLoading,
  loading => loading
)

export const selectPriceChart = createSelector(
  selectDecoratedTrades,
  trades => trades.sort((a,b) => a.timestamp - b.timestamp).map(trade => {
    return ({
      series: [
        { data: []}
      ]
    })
  })
)
