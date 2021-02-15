import {ether, ETHER_ADDRESS, formatTimestamp, tokens} from "../helpers";

export const decorateOrder = (order) => {
  const etherAmount = order.tokenGive === ETHER_ADDRESS ? order.amountGive : order.amountGet;
  const sproutAmount = order.tokenGive !== ETHER_ADDRESS ? order.amountGive : order.amountGet;
  const precision = 100000;
  let tokenPrice = (etherAmount/sproutAmount);
  tokenPrice = Math.round(tokenPrice * precision) / precision;

  return ({
    ...order,
    etherAmount: ether(etherAmount),
    sproutAmount: tokens(sproutAmount),
    tokenPrice,
    createdAt: formatTimestamp(order.timestamp)
  });
}