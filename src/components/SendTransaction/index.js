import React from 'react';
import { connect } from 'react-redux';
import ethereumjsAbi from 'ethereumjs-abi';
import Ethereum from '../Ethereum';
import CopyButton from '../CopyButton';
import s from './SendTransaction.css';
import Popup from '../Popup';
import Button from '../Button';
import actions from '../../actions';

class SendTransaction extends React.Component {
  static propTypes = {
    active: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    confirmText: React.PropTypes.string,
    children: React.PropTypes.object, //TODO: Fix this error
  };
  constructor(props) {
    super(props);
    this.state = {
      gas: 200000,
    }
  }

  getData = () => {
    if (!this.props.popup.data) return '';
    return ethereumjsAbi.simpleEncode('transfer(bytes32,address)', window.web3.sha3(this.props.popup.data.name), '0x0000000000000000000000000000000000000000').toString('hex');
  }

  hidePopup = () => {
    this.props.dispatch(actions.ethereum.hidePopup());
  }

  sendTransaction = () => {
    const data = {
      to: this.props.popup.data.to,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(this.props.popup.data.value).toString(),
      gas: this.state.gas,
      data: this.props.popup.data.data,
    };
    console.log(data);
    window.web3.eth.sendTransaction(data, (a, b) => console.log(a, b))
  }

  copy = data => () => { copy(data); };

  changeGas = (e) => {
    this.setState({ gas: e.target.value });
  }

  render() {
    if (!this.props.active) return null;
    return (
      <Popup active={this.props.active} onClose={this.hidePopup}>
        <div>
          <h4>New Transaction</h4>
          <div className={s.label}>To <CopyButton data={this.props.popup.data.to} /></div>
          <div><input type="text" readOnly className={s.input} value={this.props.popup.data.to}></input></div>
          <div className={s.label}>Amount <CopyButton data={this.props.popup.data.value} /></div>
          <div><input type="text" readOnly className={s.input} value={this.props.popup.data.value}></input></div>
          <div className={s.label}>Gas <CopyButton data={this.props.popup.data.gas} /></div>
          <div><input type="text" className={s.input} value={this.state.gas} onChange={this.changeGas}></input></div>
          <div className={s.label}>Data (Important) <CopyButton data={this.props.popup.data.data} /></div>
          <div><textarea className={s.input} rows="7" readOnly value={this.props.popup.data.data}></textarea></div>
          <div className={s.center}>
            <div>Copy the above values to your ethereum wallet,<b/>or send via Web3</div>
            <div>
              <Button
                inline
                text="Send via Web3 (Metamask/Mist)"
                onClick={this.sendTransaction}
                disabled={!Ethereum.isLocalWeb3()}
              />
              <Button
                inline
                text="Cancel"
                onClick={this.hidePopup}
              />
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

function mapStateToProps(str) {
  return {
    popup: str.popup,
    dispatch: str.dispatch,
  };
}

export default connect(mapStateToProps)(SendTransaction);
