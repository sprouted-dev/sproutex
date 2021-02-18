import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';

import { fetchAllOrders } from '../services/exchange.service';
import {createSelector} from "reselect";

export const ORDER_SLICE_KEY = 'orders';
export const orderAdapter = createEntityAdapter();

export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  return await fetchAllOrders();
})

const initialState = orderAdapter.getInitialState({loading: false});

export const slice = createSlice({
  name: ORDER_SLICE_KEY,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      orderAdapter.upsertMany(state, action.payload.orders);
      state.loading = false;
    });
  }
})

const reducer = slice.reducer;
export default reducer;

export const {
  selectById: selectOrderById,
  selectIds: selectOrderIds,
  selectEntities: selectOrderEntities,
  selectAll: selectAllOrders,
  selectTotal: selectTotalOrders
} = orderAdapter.getSelectors(state => state[ORDER_SLICE_KEY]);

export const selectAllOrdersState = state => state[ORDER_SLICE_KEY];

export const selectAllOrdersLoading = createSelector(
  selectAllOrdersState,
  state => state.loading
)