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

export const getStartOfPeriod = (ts, period) => moment.unix(ts).startOf(period).format()

export const groupBy = (arr, criteria) => arr.reduce((o, item) => {
  const key = typeof criteria === 'function' ? criteria(item) : item[criteria]

  if (!o.hasOwnProperty(key)) {
    o[key] = [];
  }
  o[key].push(item);
  return o;
}, {})

export const maxBy = (items, fn) =>
  Math.max(...items.map(typeof fn === "function" ? fn : val => val[fn]));

export const minBy = (items, fn) =>
  Math.min(...items.map(typeof fn === 'function' ? fn : val => val[fn]));

export const formatBalance = (balance) => Math.round(ether(balance) * 100)/100