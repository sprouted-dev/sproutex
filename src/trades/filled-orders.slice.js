import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';
import {fetchFilledOrders as fetchOrders, fillOrder as fillExchangeOrder} from '../api/exchange.service';
import {createSelector} from "reselect";
import {GREEN, RED} from "../helpers";
import {decorateOrder} from "../utils/order.util";

export const FILLED_ORDER_SLICE_KEY = 'filledOrders';
export const orderAdapter = createEntityAdapter();

export const fetchFilledOrders = createAsyncThunk("orders/fetchFilled", async () => {
  return await fetchOrders();
})

export const fillOrder = createAsyncThunk("orders/fillOrder", async ({order, account}) => {
  await fillExchangeOrder({order, account});
})

const initialState = orderAdapter.getInitialState({loading: false});

export const slice = createSlice({
  name: FILLED_ORDER_SLICE_KEY,
  initialState,
  reducers: {
    orderFilled: (state, action) => {
      const {order} = action.payload;
      orderAdapter.addOne(state, order);
      state.fillOrderPending = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchFilledOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchFilledOrders.fulfilled, (state, action) => {
      orderAdapter.upsertMany(state, action.payload.trades);
      state.loading = false;
    });
    builder.addCase(fillOrder.pending, (state, action) => {
      state.fillOrderPending = true;
    });
    builder.addCase(fillOrder.rejected, (state, action) => {
      state.fillOrderPending = false;
      state.fillOrderError = action.error
    })
  }
})

const reducer = slice.reducer;
export default reducer;

export const {
  orderFilled
} = slice.actions;

export const selectFilledOrderState = state => state[FILLED_ORDER_SLICE_KEY];
export const selectFilledOrdersLoading = createSelector(
  selectFilledOrderState,
  state => state.loading
)

export const {
  selectById: selectFilledOrderById,
  selectIds: selectFilledOrderIds,
  selectEntities: selectFilledOrderEntities,
  selectAll: selectAllFilledOrders,
  selectTotal: selectTotalFilledOrders
} = orderAdapter.getSelectors(state => state[FILLED_ORDER_SLICE_KEY]);

export const calculateFriendlyAmounts = createSelector(
  selectAllFilledOrders,
  trades => trades.map(t => decorateOrder(t))
)

export const selectTradesByTimestamp = createSelector(
  calculateFriendlyAmounts,
  trades => trades.sort((a,b) => a.timestamp - b.timestamp)
)

const decorateTrade = (trade, prev) => {
  return ({
    ...trade,
    sproutPriceClass: trade.tokenPrice >= prev.tokenPrice ? GREEN : RED
  })
}

export const selectDecoratedTrades = createSelector(
  calculateFriendlyAmounts,
  trades => {
    let prev;
    return trades.map((trade, index) => {
      prev = index === 0 ? 0 : index - 1;
      return decorateTrade(trade, trades[prev]);
    })
  }
)

export const selectFillOrderPending = createSelector(
  selectFilledOrderState,
  state => state.fillOrderPending
)