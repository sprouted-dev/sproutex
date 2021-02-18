import Sprout from '../abis/Sprout.json';
import {sproutSlice} from "../state/sprout.slice";

const { sproutContractLoaded } = sproutSlice.actions;

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