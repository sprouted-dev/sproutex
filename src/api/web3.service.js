import Web3 from 'web3';
import {
  web3Connected,
  web3AccountLoaded,
  web3NetworkLoaded
} from '../state/web3.slice';
import {etherBalanceLoaded} from '../balance/balances.slice';

let _web3;
let _dispatch;

export const loadWeb3 = async (dispatch) => {
  _web3 = new Web3(window.ethereum);
  _dispatch = dispatch;
  _dispatch(web3Connected({connected: true}))
  return _web3;
}

export const loadAccounts = async () => {
  const {getAccounts} = _web3.eth;
  const [account] = await getAccounts();
  _dispatch(web3AccountLoaded({account}));
}

export const loadNetwork = async () => {
  const {net} = _web3.eth;
  const networkId = await net.getId();
  _dispatch(web3NetworkLoaded({networkId}));
}

export const getEtherBalanceForAccount = async (account) => {
  if (_web3) {
    const etherBalance = await _web3.eth.getBalance(account);
    _dispatch(etherBalanceLoaded({etherBalance}))
  }

}
