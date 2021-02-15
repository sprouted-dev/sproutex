import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';
import {fetchFilledOrders as fetchOrders} from '../services/exchange.service';
import {createSelector} from "reselect";
import {GREEN, RED} from "../helpers";
import {decorateOrder} from "../utils/order.util";

export const FILLED_ORDER_SLICE_KEY = 'filledOrders';

export const fetchFilledOrders = createAsyncThunk("orders/fetchFilled", async () => {
  return await fetchOrders();
})

export const orderAdapter = createEntityAdapter();

const initialState = orderAdapter.getInitialState({loading: false});

export const slice = createSlice({
  name: FILLED_ORDER_SLICE_KEY,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchFilledOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchFilledOrders.fulfilled, (state, action) => {
      orderAdapter.upsertMany(state, action.payload.trades);
      state.loading = false;
    })
  }
})

const reducer = slice.reducer;
export default reducer;

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