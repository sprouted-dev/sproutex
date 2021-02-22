import React, {useEffect} from 'react';
import Navbar from "./components/Navbar";
import {useDispatch, useSelector} from "react-redux";
import Main from "./components/Main";
import PageLoading from "./components/PageLoading";
import {loadAccounts, loadWeb3} from "./api/web3.api";
import {loadContract as loadSprout} from "./api/sprout.api";
import {loadContract as loadExchange} from "./api/exchange.api";
import {selectAppLoaded} from "./state/root.reducer";

const App = () => {

  const loaded = useSelector(selectAppLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      try {
        const web3 = await loadWeb3(dispatch);
        await loadAccounts();
        const sprout = await loadSprout(web3, dispatch);
        await loadExchange(web3, dispatch, sprout);
      } catch (e) {
        console.log(e);
      }
    }
    initApp();
  }, [dispatch])

  return (
      <div>
          <Navbar />
          { loaded ? ( <Main /> ) : ( <PageLoading /> ) }
      </div>
  )
}

export default App;