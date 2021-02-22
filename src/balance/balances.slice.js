import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
  depositEther as depositExchangeEther,
  withdrawEther as withdrawExchangeEther,
  withdrawSprouts as withdrawExchangeSprouts,
  depositSprouts as depositExchangeSprouts,
} from "../api/exchange.api";
import {createSelector} from "reselect";
import {formatBalance} from "../helpers";
import {getEtherBalanceForAccount} from "../api/web3.api";
import {getSproutBalanceForAccount} from "../api/sprout.api";
import {getExchangeEtherBalanceForAccount, getExchangeSproutBalanceForAccount} from "../api/exchange.api";

export const SLICE_KEY = 'balances';

const initialState = {
  loading: false,
  balanceRefreshPending: false,
  exchangeEtherBalance: 0,
  exchangeSproutBalance: 0,
  sproutBalance: 0,
  etherBalance: 0
};

export const depositEther = createAsyncThunk("exchange/depositEther", async ({amount, account}) => {
  await depositExchangeEther({amount, account});
})

export const withdrawEther = createAsyncThunk("exchange/withdrawEther", async ({amount, account}) => {
  await withdrawExchangeEther({amount, account});
})

export const depositSprouts = createAsyncThunk("exchange/depositSprouts", async ({amount, account}) => {
  await depositExchangeSprouts({amount, account});
})

export const withdrawSprouts = createAsyncThunk("exchange/withdrawSprouts", async ({amount, account}) => {
  await withdrawExchangeSprouts({amount, account});
})

export const refreshBalances = createAsyncThunk("balances/refresh", async ({account}) => {
  await Promise.all([
    getEtherBalanceForAccount(account),
    getSproutBalanceForAccount(account),
    getExchangeEtherBalanceForAccount(account),
    getExchangeSproutBalanceForAccount(account)
  ]);
})

export const balanceSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    exchangeEtherBalanceLoaded: (state, action) => {
      const {exchangeEtherBalance} = action.payload;
      return {...state, exchangeEtherBalance}
    },
    exchangeSproutBalanceLoaded: (state, action) => {
      const {exchangeSproutBalance} = action.payload;
      return {...state, exchangeSproutBalance}
    },
    sproutBalanceLoaded: (state, action) => {
      const {sproutBalance} = action.payload;
      return {...state, sproutBalance}
    },
    etherBalanceLoaded: (state, action) => {
      const {etherBalance} = action.payload;
      return {...state, etherBalance}
    },
    etherDeposited: (state, action) => {
      state.depositEtherPending = false;
    },
    etherWithdrawn: (state, action) => {
      state.withdrawEtherPending = false;
    },
    sproutsDeposited: (state, action) => {
      state.depositSproutsPending = false;
    },
    sproutsWithdrawn: (state, action) => {
      state.withdrawSproutsPending = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(depositEther.pending, (state, action) => {
      state.depositEtherPending = true;
    });
    builder.addCase(depositEther.rejected, (state, action) => {
      state.depositEtherPending = false;
      state.depositEtherError = action.error
    })
    builder.addCase(withdrawEther.pending, (state, action) => {
      state.withdrawEtherPending = true;
    });
    builder.addCase(withdrawEther.rejected, (state, action) => {
      state.withdrawEtherPending = false;
      state.withdrawEtherError = action.error
    })
    builder.addCase(depositSprouts.pending, (state, action) => {
      state.depositSproutsPending = true;
    });
    builder.addCase(depositSprouts.rejected, (state, action) => {
      state.depositSproutsPending = false;
      state.depositSproutsError = action.error
    })
    builder.addCase(withdrawSprouts.pending, (state, action) => {
      state.withdrawSproutsPending = true;
    });
    builder.addCase(withdrawSprouts.rejected, (state, action) => {
      state.withdrawSproutsPending = false;
      state.withdrawSproutsError = action.error
    })
    builder.addCase(refreshBalances.pending, (state, action) => {
      state.balanceRefreshPending = true;
    });
    builder.addCase(refreshBalances.rejected, (state, action) => {
      state.balanceRefreshPending = false;
      state.balanceRefreshError = action.error
    })
    builder.addCase(refreshBalances.fulfilled, (state, action) => {
      state.balanceRefreshPending = false;
      state.balanceRefreshError = null;
    })
  }
})

export const {
  exchangeEtherBalanceLoaded,
  exchangeSproutBalanceLoaded,
  etherDeposited,
  etherWithdrawn,
  etherBalanceLoaded,
  sproutBalanceLoaded,
  sproutsDeposited,
  sproutsWithdrawn
} = balanceSlice.actions;

const reducer = balanceSlice.reducer;
export default reducer;


export const selectBalanceState = state => state[SLICE_KEY];

export const selectBalanceRefreshPending = createSelector(
  selectBalanceState,
  state => state.balanceRefreshPending
);

export const selectExchangeError = createSelector(
  selectBalanceState,
  state => state.error
);

export const selectExchangeEtherBalance = createSelector(
  selectBalanceState,
  state => state.exchangeEtherBalance
);

export const selectExchangeSproutBalance = createSelector(
  selectBalanceState,
  state => state.exchangeSproutBalance
);

export const selectFormattedExchangeSproutBalance = createSelector(
  selectExchangeSproutBalance,
  balance => formatBalance(balance)
);

export const selectFormattedExchangeEtherBalance = createSelector(
  selectExchangeEtherBalance,
  balance => formatBalance(balance)
);

export const selectSproutBalance = createSelector(
  selectBalanceState,
  state => state.sproutBalance
);

export const selectFormattedSproutBalance = createSelector(
  selectSproutBalance,
  balance => formatBalance(balance)
);

export const selectEtherBalance = createSelector(
  selectBalanceState,
  state => state.etherBalance
);

export const selectFormattedEtherBalance = createSelector(
  selectEtherBalance,
  balance => formatBalance(balance)
);
