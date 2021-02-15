import Web3 from 'web3';

let web3;

export const loadWeb3 = async () => {
  web3 = new Web3(window.ethereum);
  return web3;
}

export const loadAccounts = async () => {
  const {getAccounts} = web3.eth;
  return await getAccounts();
}

export const loadNetwork = async () => {
  const {net} = web3.eth;
  await net.getId();
}
