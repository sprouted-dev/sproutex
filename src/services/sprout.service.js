import Sprout from '../abis/Sprout.json';

let _contract;
let _web3;
let _abiData;

export const loadContract = async (web3) => {
  _web3 = web3
  const {Contract, net} = _web3.eth;
  const networkId = await net.getId();
  _abiData = Sprout.networks[networkId];

  try {
    _contract = new Contract(Sprout.abi, _abiData.address);
    return _contract;
  } catch (error) {
    throw error;
  }

}