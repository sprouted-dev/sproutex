import React from "react";
import SproutedLogo from "./SproutedLogo";
import {selectExchangeName} from "../state/root.reducer";
import Identicon from 'identicon.js';
import {useSelector} from "react-redux";
import {selectWeb3Account} from "../state/web3.slice";

const Navbar = () => {

  const exchangeName = useSelector(selectExchangeName);
  const account = useSelector(selectWeb3Account);

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/#">
          <SproutedLogo />
          { exchangeName }
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">

        </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
            </small>
            { account
                ? <img
                    className='ml-2'
                    width='30'
                    height='30'
                    alt='Identicon'
                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                />
                : <span></span>
            }
          </li>
        </ul>
      </nav>
  )
}

export default Navbar;