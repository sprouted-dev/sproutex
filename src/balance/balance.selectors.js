import {createSelector} from "reselect";
import {
  selectFormattedEtherBalance,
  selectFormattedSproutBalance,
  selectFormattedExchangeEtherBalance,
  selectFormattedExchangeSproutBalance
} from "./balances.slice";

export const selectAccountBalances = createSelector(
  selectFormattedEtherBalance,
  selectFormattedSproutBalance,
  selectFormattedExchangeEtherBalance,
  selectFormattedExchangeSproutBalance,
  (etherBalance, sproutBalance, exchangeEtherBalance, exchangeSproutBalance) => ({
    etherBalance,
    sproutBalance,
    exchangeEtherBalance,
    exchangeSproutBalance
  })
)
