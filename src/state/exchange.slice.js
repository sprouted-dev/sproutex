import {createSlice} from "@reduxjs/toolkit";
import {createSelector} from "reselect";

export const SLICE_KEY = 'exchange';

const initialState = {
  loaded: false
};

export const exchangeSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    exchangeContractLoaded: (state, action) => {
      const {loaded} = action.payload;
      return {...state, loaded}
    },
    exchangeContractFailed: (state, action) => {
      const {error} = action.payload;
      return {...state, error};
    }
  }
})

export const {
  exchangeContractLoaded,
  exchangeContractFailed
} = exchangeSlice.actions;

const reducer = exchangeSlice.reducer;
export default reducer;


export const selectExchangeState = state => state[SLICE_KEY];

export const selectExchangeLoaded = createSelector(
    selectExchangeState,
    state => state.loaded
);

export const selectExchangeError = createSelector(
    selectExchangeState,
    state => state.error
);
