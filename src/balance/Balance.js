import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectWeb3Account} from "../state/web3.slice";
import {selectAccountBalances} from "./balance.selectors";
import Spinner from "../components/Spinner";
import {Tab, Tabs} from "react-bootstrap";
import BalanceDisplay from "./BalanceDisplay";
import DepositForm from "./DepositForm";
import {depositEther, refreshBalances, selectBalanceRefreshPending} from "./balances.slice";

const Balance = () => {

  const {
    etherBalance,
    sproutBalance,
    exchangeEtherBalance,
    exchangeSproutBalance
  } = useSelector(selectAccountBalances);
  const account = useSelector(selectWeb3Account);
  const loading = useSelector(selectBalanceRefreshPending);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshBalances({account}));
  }, [account, dispatch])

  const handleDepositEther = ({amount}) => {
    dispatch(depositEther({amount, account}));
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
                <DepositForm depositEther={handleDepositEther}/>
              </Tab>
              <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                <BalanceDisplay
                  sproutBalance={sproutBalance}
                  etherBalance={etherBalance}
                  exchangeEtherBalance={exchangeEtherBalance}
                  exchangeSproutBalance={exchangeSproutBalance}
                />
              </Tab>
            </Tabs>
          )
        }

      </div>
    </div>
  )
}

export default Balance;