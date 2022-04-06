import "./Setting.css";

function Setting(props) {
  return (
    <div className="settings-overlay">
      <div className="settings-header">
        <h3>Transaction Settings</h3>
      </div>
      <div className="settings-content">
        <div className="settings">
          <div>
            <h4>Slippage ?</h4>
          </div>
          <div className="transaction">
            <input
              className="setting-input"
              onChange={props.onSlippageChange}
              value={props.slippage}
            ></input>
            <h4>%</h4>
          </div>
        </div>
        <div className="settings">
          <h4>Transaction deadline ?</h4>
          <div className="transaction">
            <input
              className="setting-input"
              value={props.deadline}
              onChange={props.onDeadlineChange}
            ></input>
            <h4>minutes</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
