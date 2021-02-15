import React, {useEffect} from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import {connect} from "react-redux";
import {web3Slice} from "./state/web3.slice";
import {sproutSlice} from "./state/sprout.slice";
import {exchangeSlice} from "./state/exchange.slice";
import Main from "./components/Main";
import PageLoading from "./components/PageLoading";
import {loadAccounts, loadWeb3} from "./services/web3.service";
import {loadContract as loadSprout} from "./services/sprout.service";
import {loadContract as loadExchange} from "./services/exchange.service";
import {selectAppLoaded} from "./state/root.reducer";

const { web3Connected, web3AccountLoaded } = web3Slice.actions;
const { sproutContractLoaded } = sproutSlice.actions;
const { exchangeContractLoaded } = exchangeSlice.actions;

let web3;

const App = ({loaded, web3Connected, sproutContractLoaded, exchangeContractLoaded, web3AccountLoaded}) => {

  useEffect(() => {
    const initApp = async () => {
      try {
        web3 = await loadWeb3();
        const [account] = await loadAccounts();
        web3AccountLoaded({account})
        web3Connected({connected: true})
        await loadSprout(web3);
        sproutContractLoaded({loaded: true})
        await loadExchange(web3);
        exchangeContractLoaded({loaded: true})
      } catch (e) {
        console.log(e);
      }

    }
    initApp();
  }, [web3AccountLoaded, web3Connected, sproutContractLoaded, exchangeContractLoaded])

  return (
      <div>
          <Navbar />
          { loaded ? (
                <Main />
            ) : (
                <PageLoading />
            )
          }


      </div>
  )
}

const mapStateToProps = state => ({
    loaded: selectAppLoaded(state)
})
export default connect(mapStateToProps, {web3Connected, web3AccountLoaded, sproutContractLoaded, exchangeContractLoaded})(App);