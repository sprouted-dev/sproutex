import Exchange from '../abis/Exchange.json';

let _contract;
let _web3;
let _abiData;

export const loadContract = async (web3) => {
  _web3 = web3
  const {Contract, net} = _web3.eth;
  const networkId = await net.getId();
  _abiData = Exchange.networks[networkId];

  try {
    _contract = new Contract(Exchange.abi, _abiData.address);
    return _contract;
  } catch (error) {
    throw error
  }

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