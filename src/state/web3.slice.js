import {createSlice} from "@reduxjs/toolkit";
import {createSelector} from "reselect";

export const SLICE_KEY = 'web3';

const initialState = {
  connected: false,
  account: null
};

export const web3Slice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    web3Connected: (state, action) => {
      const {connected} = action.payload;
      return {...state, connected}
    },
    web3AccountLoaded: (state, action) => {
      const {account} = action.payload;
      return {...state, account}
    },
    web3NetworkLoaded: (state, action) => {
      const {networkId} = action.payload;
      return {...state, networkId}
    }
  }
})

const reducer = web3Slice.reducer;
export default reducer;

export const {
  web3Connected,
  web3AccountLoaded,
  web3NetworkLoaded
} = web3Slice.actions;


export const selectWeb3State = state => state[SLICE_KEY];

export const selectWeb3Account = createSelector(
  selectWeb3State,
  state => state.account
);

export const selectWeb3Network = createSelector(
  selectWeb3State,
  state => state.networkId
);


export const selectWeb3Connected = createSelector(
  selectWeb3State,
  state => state.connected
);