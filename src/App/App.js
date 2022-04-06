import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Setting from "../Main/Setting";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  var userEthAddress;
  const [hasAddress, setHasAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState({ networkId: 0, networkName: "" });
  const [appearSettings, setAppearSettings] = useState(false);
  const [deadline, setDeadline] = useState(30);
  const [slippage, setSlippage] = useState(0.5);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  useEffect(() => {
    if (!window.ethereum) {
      alert("No Metamask detected. Please install.");
    }
    if (window.localStorage.getItem("userEthAddress")) {
      userEthAddress = window.localStorage.getItem("userEthAddress");
      setAddress(userEthAddress);
      setHasAddress(true);
    }

    async function getNetwork() {
      const networkObj = await provider.getNetwork();
      setNetwork({
        networkId: networkObj.chainId,
        networkName: networkObj.name,
      });
    }

    getNetwork();
  });

  async function loginWithEth() {
    if (window.ethereum) {
      const ether = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await ether.listAccounts();
        window.localStorage.setItem("userEthAddress", accounts[0]);
        setAddress(accounts[0]);
        setHasAddress(true);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function logoutFromEth() {
    window.userEthAddress = "";
    window.localStorage.removeItem("userEthAddress");
    setHasAddress(false);
    setAddress("");
  }

  function toggleOverlay() {
    setAppearSettings(!appearSettings);
  }

  function onDeadlineChange(event) {
    event.preventDefault();
    setDeadline(event.target.value);
  }

  function onSlippageChange(event) {
    event.preventDefault();
    setSlippage(event.target.value);
  }
  return (
    <React.Fragment>
      <Header
        loginWithEth={loginWithEth}
        logoutFromEth={logoutFromEth}
        hasAddress={hasAddress}
        address={address}
        network={network}
      />
      <Main
        hasAddress={hasAddress}
        provider={provider}
        network={network}
        toggleOverlay={toggleOverlay}
        deadline={deadline}
        slippage={slippage}
      />
      {appearSettings ? (
        <Setting
          deadline={deadline}
          slippage={slippage}
          onDeadlineChange={onDeadlineChange}
          onSlippageChange={onSlippageChange}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default App;
