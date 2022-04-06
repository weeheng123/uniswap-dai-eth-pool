import "./Header.css";
import { ReactComponent as Uniswap } from "../assets/logo_uniswap.svg";
import React, { useState, useEffect } from "react";

function Header(props) {
  var tempAddress;
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (props.address) {
      if (props.address.length > 20) {
        tempAddress =
          props.address.substr(0, 4) +
          "..." +
          props.address.substr(props.address.length - 4, props.address.length);
      }
      setAddress(tempAddress);
    }
  }, [props.hasAddress]);
  return (
    <div className="container">
      <div className="nav-container">
        <div className="left-div">
          <Uniswap />
        </div>
        <div className="middle-div">
          <h3>Pool</h3>
        </div>
        <div
          className="right-div"
          onClick={props.hasAddress ? props.logoutFromEth : props.loginWithEth}
        >
          <h3>
            {props.network.networkName !== null
              ? props.network.networkName
              : "Network"}
          </h3>
          <h3 className="connect-wallet">
            {props.hasAddress ? address : "Connect Wallet"}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Header;
