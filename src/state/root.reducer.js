import {combineReducers} from "redux";
import {createSelector} from "reselect";
import {web3Slice, SLICE_KEY as WEB3_KEY, selectWeb3Connected} from './web3.slice';
import {sproutSlice, SLICE_KEY as SPROUT_KEY, selectSproutLoaded} from './sprout.slice';
import {exchangeSlice, SLICE_KEY as EXCHANGE_KEY, selectExchangeLoaded} from './exchange.slice';
import orderReducer, {ORDER_SLICE_KEY} from "./orders.slice";
import cancelledOrderReducer, {CANCELLED_ORDER_SLICE_KEY} from "./cancelled-orders.slice";
import filledOrderReducer, {FILLED_ORDER_SLICE_KEY} from "./filled-orders.slice";

const initialState = {
  exchangeName: 'SproutEx'
};

const appReducer = (state = initialState) => {
  return state;
}

export const selectAppState = state => state.app;

export const selectExchangeName = createSelector(
    selectAppState,
    app => app.exchangeName
)

export const selectAppLoaded = createSelector(
    selectSproutLoaded,
    selectWeb3Connected,
    selectExchangeLoaded,
    (sproutLoaded, web3Connected, exchangeLoaded) => (sproutLoaded && web3Connected && exchangeLoaded)
)

export const rootReducer = combineReducers({
  app: appReducer,
  [WEB3_KEY]: web3Slice.reducer,
  [SPROUT_KEY]: sproutSlice.reducer,
  [EXCHANGE_KEY]: exchangeSlice.reducer,
  [ORDER_SLICE_KEY]: orderReducer,
  [CANCELLED_ORDER_SLICE_KEY]: cancelledOrderReducer,
  [FILLED_ORDER_SLICE_KEY]: filledOrderReducer
})

export default rootReducer;