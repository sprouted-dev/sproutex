import Web3 from 'web3';
import {web3Slice} from '../state/web3.slice';

const {
  web3Connected,
  web3AccountLoaded,
  web3NetworkLoaded
} = web3Slice.actions;

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
