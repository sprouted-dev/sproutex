import moment from "moment";

export const DECIMALS = (10**18)

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ether = (n) => {
  if (n) {
    return n / DECIMALS;
  }
}

export const tokens = ether;

export const GREEN = 'success';
export const RED = 'danger';

export const formatTimestamp = (ts) => moment.unix(ts).format('h:mm:ss a M/D')