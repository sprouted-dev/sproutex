import {createSlice} from "@reduxjs/toolkit";
import {createSelector} from "reselect";

export const SLICE_KEY = 'sprout';

const initialState = {
  loaded: false
};

export const selectSproutState = state => state[SLICE_KEY];

export const selectSproutLoaded = createSelector(
    selectSproutState,
    state => state.loaded
);

export const selectSproutError = createSelector(
    selectSproutState,
    state => state.error
);

export const sproutSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    sproutContractLoaded: (state, action) => {
      const {loaded} = action.payload;
      return {...state, loaded}
    },
    sproutContractFailed: (state, action) => {
      const {error} = action.payload;
      return {...state, error};
    }
  }
})

const reducer = sproutSlice.reducer;
export default reducer;

export const {
  sproutContractLoaded,
  sproutContractFailed
} = sproutSlice.actions;