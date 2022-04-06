import "./Token.css";

function Token(props) {
  return (
    <div className="main-token">
      <div className="input-and-button">
        <input
          className="token-1-input"
          placeholder="0"
          onChange={props.onChange}
          value={props.tokenAmount === 0 ? "" : props.tokenAmount}
        ></input>
        <h1 className="token-name">{props.token}</h1>
      </div>
      <div className="balance-and-button">
        <button className="max" onClick={props.onMaxClick}>
          max
        </button>
        <h4 className="balance">
          Balance:{" "}
          <span>
            {props.tokenBalance === 0 ? "0.0000000" : props.tokenBalance}
          </span>
        </h4>
      </div>
    </div>
  );
}

export default Token;
