import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createSelector} from "reselect";
import {approve} from "../api/sprout.api";

export const SLICE_KEY = 'sprout';

const initialState = {
  loaded: false,
  approvalPending: false
};

export const approveUser = createAsyncThunk("sprout/approve", async ({amount, authorizeAccount, accountOwner}) => {
  await approve({amount, authorizeAccount, accountOwner});
})

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
  },
  extraReducers: builder => {
    builder.addCase(approveUser.pending, (state, action) => {
      state.approvalPending = true;
    });
    builder.addCase(approveUser.rejected, (state, action) => {
      state.approvalPending = false;
      state.approvalPendingError = action.error
    })
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.approvalPending = false;
      state.approvalPendingError = null;
    })
  }
})

const reducer = sproutSlice.reducer;
export default reducer;

export const {
  sproutContractLoaded,
  sproutContractFailed
} = sproutSlice.actions;


export const selectSproutState = state => state[SLICE_KEY];

export const selectSproutLoaded = createSelector(
  selectSproutState,
  state => state.loaded
);

export const selectSproutError = createSelector(
  selectSproutState,
  state => state.error
);
