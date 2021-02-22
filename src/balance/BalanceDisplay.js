import React from "react";

const BalanceDisplay = ({etherBalance, exchangeEtherBalance, sproutBalance, exchangeSproutBalance}) => {

  return (
    <table className="table table-dark table-sm small">
      <thead>
      <tr>
        <th>Token</th>
        <th>Wallet</th>
        <th>Exchange</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>Eth</th>
        <th>{etherBalance}</th>
        <th>{exchangeEtherBalance}</th>
      </tr>
      <tr>
        <th>Sprout</th>
        <th>{sproutBalance}</th>
        <th>{exchangeSproutBalance}</th>
      </tr>
      </tbody>
    </table>
  )
}

export default BalanceDisplay;