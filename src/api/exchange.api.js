import Exchange from '../abis/Exchange.json';
import {
  exchangeEtherBalanceLoaded,
  exchangeSproutBalanceLoaded,
  etherDeposited,
  sproutsDeposited,
  sproutsWithdrawn,
  refreshBalances,
  etherWithdrawn
} from "../balance/balances.slice";
import {
  exchangeContractLoaded
} from "../state/exchange.slice";
import {orderCancelled} from "../state/cancelled-orders.slice";
import {orderFilled} from "../trades/filled-orders.slice";
import {ETHER_ADDRESS} from "../helpers";

let _contract;
let _web3;
let _abiData;
let _dispatch;
let _sprout;

export const loadContract = async (web3, dispatch, sprout) => {
  _web3 = web3
  _dispatch = dispatch
  _sprout = sprout

  const {Contract, net} = _web3.eth;
  const networkId = await net.getId();
  _abiData = Exchange.networks[networkId];

  try {
    _contract = new Contract(Exchange.abi, _abiData.address);
    _dispatch(exchangeContractLoaded({loaded: true, address: _contract.options.address}));
  } catch (error) {
    throw error
  }
}

export const getExchangeEtherBalanceForAccount = async (account) => {
  if (_web3 && account) {
    const exchangeEtherBalance = await _contract.methods.balanceOf(ETHER_ADDRESS, account).call();
    _dispatch(exchangeEtherBalanceLoaded({exchangeEtherBalance}));
  }
}

export const getExchangeSproutBalanceForAccount = async (account) => {
  if (_web3 && account) {
    const exchangeSproutBalance = await _contract.methods.balanceOf(_sprout.options.address, account).call();
    _dispatch(exchangeSproutBalanceLoaded({exchangeSproutBalance}));
  }
}

export const depositEther = async ({amount, account}) => {
  if (_contract) {
    const {toWei} = _web3.utils;
    await _contract.methods.depositEther().send({ from: account, value: toWei(amount)});
    _dispatch(etherDeposited({amount}));
    _dispatch(refreshBalances({account}));
  }
}

export const withdrawEther = async ({amount, account}) => {
  if (_contract) {
    const { toWei } = _web3.utils;
    await _contract.methods.withdrawEther(toWei(amount)).send({from: account});
    _dispatch(etherWithdrawn({amount}));
    _dispatch(refreshBalances({account}))
  }
}

export const depositSprouts = async ({amount, account}) => {
  if (_contract) {
    const {toWei} = _web3.utils;
    await _contract.methods.depositSprouts(_sprout.options.address, toWei(amount)).send({ from: account});
    _dispatch(sproutsDeposited({amount}));
    _dispatch(refreshBalances({account}));
  }
}

export const withdrawSprouts = async ({amount, account}) => {
  if (_contract) {
    const { toWei } = _web3.utils;
    await _contract.methods.withdrawSprouts(_sprout.options.address, toWei(amount)).send({from: account});
    _dispatch(sproutsWithdrawn({amount}));
    _dispatch(refreshBalances({account}))
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