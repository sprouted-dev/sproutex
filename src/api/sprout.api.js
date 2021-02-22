import Sprout from '../abis/Sprout.json';
import { sproutContractLoaded } from "../state/sprout.slice";
import {depositSprouts, sproutBalanceLoaded} from "../balance/balances.slice";

let _contract;
let _web3;
let _abiData;
let _dispatch;

export const loadContract = async (web3, dispatch) => {
  _web3 = web3
  _dispatch = dispatch
  const {Contract, net} = _web3.eth;
  const networkId = await net.getId();
  _abiData = Sprout.networks[networkId];

  try {
    _contract = new Contract(Sprout.abi, _abiData.address);
    _dispatch(sproutContractLoaded({loaded: true}));
    return _contract;
  } catch (error) {
    throw error;
  }
}

export const getSproutBalanceForAccount = async (account) => {
  if (_web3 && account) {
    const sproutBalance = await _contract.methods.balanceOf(account).call();
    _dispatch(sproutBalanceLoaded({sproutBalance}));
  }
}

export const approve = async ({amount, authorizeAccount, accountOwner}) => {
  if (_contract) {
    const { toWei } = _web3.utils;
    await _contract.methods.approve(authorizeAccount, toWei(amount)).send({from: accountOwner});
    _dispatch(depositSprouts({amount, account: accountOwner}))
  }
}