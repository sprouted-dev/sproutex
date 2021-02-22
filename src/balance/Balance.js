import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectWeb3Account} from "../state/web3.slice";
import {selectAccountBalances} from "./balance.selectors";
import Spinner from "../components/Spinner";
import {Tab, Tabs} from "react-bootstrap";
import BalanceDisplay from "./BalanceDisplay";
import DepositWithdrawForm from "./DepositWithdrawForm";
import {
  depositEther,
  withdrawEther,
  withdrawSprouts,
  refreshBalances,
  selectBalanceRefreshPending
} from "./balances.slice";
import {approveUser} from "../state/sprout.slice";
import {selectExchangeAddress} from "../state/exchange.slice";

const Balance = () => {

  const {
    etherBalance,
    sproutBalance,
    exchangeEtherBalance,
    exchangeSproutBalance
  } = useSelector(selectAccountBalances);
  const account = useSelector(selectWeb3Account);
  const loading = useSelector(selectBalanceRefreshPending);
  const exchangeAddress = useSelector(selectExchangeAddress);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshBalances({account}));
  }, [account, dispatch])

  const handleDepositEther = ({amount}) => {
    dispatch(depositEther({amount, account}));
  }

  const handleDepositSprouts = ({amount}) => {
    dispatch(approveUser({amount, authorizeAccount: exchangeAddress, accountOwner: account}));
  }

  const handleWithdrawEther = ({amount}) => {
    dispatch(withdrawEther({amount, account}));
  }

  const handleWithdrawSprouts = ({amount}) => {
    dispatch(withdrawSprouts({amount, account}));
  }

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Balance
      </div>
      <div className="card-body">
        {
          loading ? (
            <Spinner />
          ) : (
            <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
              <Tab eventKey="deposit" title="Deposit" className="bg-dark">
                <BalanceDisplay
                  sproutBalance={sproutBalance}
                  etherBalance={etherBalance}
                  exchangeEtherBalance={exchangeEtherBalance}
                  exchangeSproutBalance={exchangeSproutBalance}
                />
                <DepositWithdrawForm saveChanges={handleDepositEther} actionLabel="Deposit" actionPlaceholder="Ether Amount"/>
                <DepositWithdrawForm saveChanges={handleDepositSprouts} actionLabel="Deposit" actionPlaceholder="Sprout Amount"/>
              </Tab>
              <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                <BalanceDisplay
                  sproutBalance={sproutBalance}
                  etherBalance={etherBalance}
                  exchangeEtherBalance={exchangeEtherBalance}
                  exchangeSproutBalance={exchangeSproutBalance}
                />
                <DepositWithdrawForm saveChanges={handleWithdrawEther} actionLabel="Withdraw" actionPlaceholder="Ether Amount"/>
                <DepositWithdrawForm saveChanges={handleWithdrawSprouts} actionLabel="Withdraw" actionPlaceholder="Sprout Amount"/>
              </Tab>
            </Tabs>
          )
        }

      </div>
    </div>
  )
}

export default Balance;