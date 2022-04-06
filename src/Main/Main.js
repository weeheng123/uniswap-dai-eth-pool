import "./Main.css";
import { ReactComponent as Back } from "../assets/logo_back.svg";
import { ReactComponent as Settings } from "../assets/logo_settings.svg";
import Token from "./Token";
import { Pair } from "@uniswap/v2-sdk";
import { Token as UniToken } from "@uniswap/sdk-core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import DAITokenABI from "../abis/DAITokenABI.json";
import UniV2RouterABI from "../abis/UniswapV2RouterABI.json";

const wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
const daiAddress = "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735";
const uniV2RouterAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";

function Main(props) {
  const [ethPerDai, setEthPerDai] = useState(0);
  const [daiPerEth, setDaiPerEth] = useState(0);
  const [ethAmount, setETHAmount] = useState(0);
  const [daiAmount, setDAIAmount] = useState(0);
  const [ethTokenBalance, setETHTokenBalance] = useState(0);
  const [daiTokenBalance, setDAITokenBalance] = useState(0);

  useEffect(() => {
    const provider = props.provider;

    async function fetchPairPrice() {
      const CHAIN_ID = props.network.networkId;
      const tokenA = new UniToken(CHAIN_ID, wethAddress, 18, "WETH", "WETH");
      const tokenB = new UniToken(CHAIN_ID, daiAddress, 18, "DAI", "DAI");
      const pairAddress = Pair.getAddress(tokenA, tokenB);

      const api = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RINKEBY_API
      );

      const contract = new ethers.Contract(
        pairAddress,
        [
          "function getReserves() external view returns(uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
          "function token0() external view returns (address)",
          "function token1() external view returns (address)",
        ],
        api
      );

      const reserves = await contract.getReserves();

      setDaiPerEth(reserves.reserve1 / reserves.reserve0);
      setEthPerDai(reserves.reserve0 / reserves.reserve1);
    }

    fetchPairPrice();

    async function getAccountTokenBalances() {
      if (props.hasAddress) {
        try {
          await provider.send("eth_requestAccounts", []);
          const daiTokenContract = new ethers.Contract(
            daiAddress,
            DAITokenABI,
            provider
          );
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress();
          var daiTokenBalance = await daiTokenContract.balanceOf(signerAddress);
          var ethTokenBalance = await provider.getBalance(signerAddress);
          ethTokenBalance = ethers.utils.formatEther(ethTokenBalance);
          daiTokenBalance = ethers.utils.formatEther(daiTokenBalance);
          setETHTokenBalance(Number(ethTokenBalance));
          setDAITokenBalance(Number(daiTokenBalance));
        } catch (error) {
          console.log(error);
        }
      }
    }

    getAccountTokenBalances();
  }, [props.hasAddress]);

  const addLiquidity = async () => {
    try {
      const provider = props.provider;

      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const routerContract = new ethers.Contract(
        uniV2RouterAddress,
        UniV2RouterABI,
        signer
      );

      var strEthAmount = String(Number(ethAmount).toFixed(16));
      var strDaiAmount = String(Number(daiAmount).toFixed(16));
      var strEthSlippage = String(
        Number(ethAmount * (1 - props.slippage / 100)).toFixed(16)
      );
      var strDaiSlippage = String(
        Number(daiAmount * (1 - props.slippage / 100)).toFixed(16)
      );

      // console.log(bnEthAmount);
      // console.log(bnDaiSlippage);
      await routerContract
        .addLiquidityETH(
          daiAddress,
          ethers.utils.parseEther(strDaiAmount),
          ethers.utils.parseEther(strDaiSlippage),
          ethers.utils.parseEther(strEthSlippage),
          signerAddress,
          Date.now() + 60000 * props.deadline,
          { value: ethers.utils.parseEther(strEthAmount) }
        )
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      const errorObj = error;
      alert(errorObj.message);
      console.log(error);
    }
  };

  function onETHChange(event) {
    event.preventDefault();
    setETHAmount(event.target.value);
    setDAIAmount(event.target.value * daiPerEth);
  }

  function onDAIChange(event) {
    event.preventDefault();
    setDAIAmount(event.target.value);
    setETHAmount(event.target.value * ethPerDai);
  }

  function onMaxClickETH() {
    if (daiPerEth !== 0) {
      if (ethTokenBalance === 0) {
        setETHAmount(0);
        setDAIAmount(0);
      } else {
        setETHAmount(ethTokenBalance);
        setDAIAmount(ethTokenBalance * daiPerEth);
      }
    } else {
      alert("Waiting for IXS per ETH to load...");
    }
  }

  function onMaxClickDAI() {
    if (daiPerEth !== 0) {
      if (daiTokenBalance === 0) {
        setETHAmount(0);
        setDAIAmount(0);
      } else {
        setDAIAmount(daiTokenBalance);
        setETHAmount(daiTokenBalance * ethPerDai);
      }
    } else {
      alert("Waiting for IXS per ETH to load...");
    }
  }

  return (
    <div className="container">
      <div className="main-container">
        <div className="main-header">
          <h2>Add Liquidity</h2>
          <Settings className="settings-button" onClick={props.toggleOverlay} />
        </div>
        <Token
          token={"ETH"}
          onChange={onETHChange}
          tokenAmount={ethAmount}
          tokenBalance={ethTokenBalance}
          onMaxClick={onMaxClickETH}
        />
        <Token
          token={"DAI"}
          onChange={onDAIChange}
          tokenAmount={daiAmount}
          tokenBalance={daiTokenBalance}
          onMaxClick={onMaxClickDAI}
        />
        <div className="main-prices">
          <div className="token-price">
            <h3>
              {daiPerEth === 0 ? "0.000000" : Number(daiPerEth).toFixed(4)}
            </h3>
            <h3 className="conversion-text">DAI Per ETH</h3>
          </div>
          <div className="token-price">
            <h3>
              {ethPerDai === 0 ? "0.000000" : Number(ethPerDai).toFixed(18)}
            </h3>
            <h3 className="conversion-text">ETH per DAI</h3>
          </div>
        </div>
        <button className="add-liquidity-button" onClick={addLiquidity}>
          Add Liquidity
        </button>
      </div>
    </div>
  );
}

export default Main;
