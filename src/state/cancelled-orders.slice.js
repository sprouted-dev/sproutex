import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';

import {fetchCancelledOrders as fetchOrders, cancelOrder as cancelExchangeOrder} from '../services/exchange.service';
import {createSelector} from "reselect";

export const CANCELLED_ORDER_SLICE_KEY = 'cancelledOrders';

export const fetchCancelledOrders = createAsyncThunk("orders/fetchCancelled", async () => {
  return await fetchOrders();
})

export const cancelOrder = createAsyncThunk("orders/cancel", async ({ order, account }) => {
  return await cancelExchangeOrder({ order, account })
})

export const orderAdapter = createEntityAdapter();

const initialState = orderAdapter.getInitialState({loading: false});

export const slice = createSlice({
  name: CANCELLED_ORDER_SLICE_KEY,
  initialState,
  reducers: {
    orderCancelled: (state, action) => {
      const {order} = action.payload;
      orderAdapter.addOne(state, order);
      state.cancelOrderPending = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchCancelledOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCancelledOrders.fulfilled, (state, action) => {
      orderAdapter.upsertMany(state, action.payload.orders);
      state.loading = false;
    })
    builder.addCase(cancelOrder.pending, (state, action) => {
      state.cancelOrderPending = true;
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.cancelOrderPending = false;
      state.cancelOrderError = action.error
    })
  }
})

const reducer = slice.reducer;
export default reducer;

export const {
  selectById: selectCancelledOrderById,
  selectIds: selectCancelledOrderIds,
  selectEntities: selectCancelledOrderEntities,
  selectAll: selectAllCancelledOrders,
  selectTotal: selectTotalCancelledOrders
} = orderAdapter.getSelectors(state => state[CANCELLED_ORDER_SLICE_KEY]);

export const selectCancelledOrderState = state => state[CANCELLED_ORDER_SLICE_KEY];

export const selectCancelledOrdersLoading = createSelector(
  selectCancelledOrderState,
  state => state.loading
)


export const selectCancelOrderPending = createSelector(
  selectCancelledOrderState,
  state => state.cancelOrderPending
)