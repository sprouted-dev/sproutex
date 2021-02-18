import Exchange from '../abis/Exchange.json';
import {exchangeSlice} from "../state/exchange.slice";
import {slice as cancelledSlice} from "../state/cancelled-orders.slice";
import {slice as filledSlice} from "../state/filled-orders.slice";

let _contract;
let _web3;
let _abiData;
let _dispatch

const { exchangeContractLoaded } = exchangeSlice.actions;
const { orderCancelled } = cancelledSlice.actions;
const { orderFilled } = filledSlice.actions;

export const loadContract = async (web3, dispatch) => {
  _web3 = web3
  _dispatch = dispatch

  const {Contract, net} = _web3.eth;
  const networkId = await net.getId();
  _abiData = Exchange.networks[networkId];

  try {
    _contract = new Contract(Exchange.abi, _abiData.address);
    _dispatch(exchangeContractLoaded({loaded: true}));
  } catch (error) {
    throw error
  }

}

export const cancelOrder = async ({order, account}) => {
  await _contract.methods.cancelOrder(order.id).send({from: account})
    .on('transactionHash', (hash) => {
      _dispatch(orderCancelled({order}))
    })
  return {order};
}

export const fillOrder = async ({order, account}) => {
  await _contract.methods.fillOrder(order.id).send({from: account})
    .on('transactionHash', (hash) => {
      _dispatch(orderFilled({order}));
    })
}

export const fetchCancelledOrders = async () => {
  const cancelledOrderStream = await _contract.getPastEvents('CancelOrder', {fromBlock: 0, toBlock: 'latest'});
  const orders = cancelledOrderStream.map(event => getOrderFromReturnValue(event.returnValues));
  return { orders }
}

export const fetchFilledOrders = async () => {
  const filledOrderStream = await _contract.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'});
  const trades = filledOrderStream.map(event => getTradeFromReturnValue(event.returnValues));
  return { trades };
}

export const fetchAllOrders = async () => {
  const orderStream = await _contract.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'});
  const orders = orderStream.map(event => getOrderFromReturnValue(event.returnValues));
  return { orders }
}

const getOrderFromReturnValue = ({ id, user, tokenGive, tokenGet, amountGive, amountGet, timestamp }) => (
  { id, user, tokenGive, tokenGet, amountGive, amountGet, timestamp }
);

const getTradeFromReturnValue = ({ id, user, userFill, tokenGive, tokenGet, amountGive, amountGet, timestamp }) => (
  { id, user, userFill, tokenGive, tokenGet, amountGive, amountGet, timestamp }
);