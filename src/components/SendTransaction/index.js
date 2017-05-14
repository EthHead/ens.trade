import React from 'react';
import { connect } from 'react-redux';
import ethereumjsAbi from 'ethereumjs-abi';
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
    this.test = 'test';
  }

  getData = () => {
    if (!this.props.popup.data) return '';
    return ethereumjsAbi.simpleEncode('transfer(bytes32,address)', window.web3.sha3(this.props.popup.data.name), '0x0000000000000000000000000000000000000000').toString('hex');
  }

  hidePopup = () => {
    this.props.dispatch(actions.ethereum.hidePopup());
  }

  sendTransaction = () => {
    window.web3.eth.sendTransaction({
      to: this.props.popup.data.to,
      from: window.web3.eth.accounts[0],
      value: this.props.popup.data.value,
      gas: this.props.popup.data.gas,
      data: this.props.popup.data.data,
    }, (a, b) => console.log(a, b))
  }

  copy = data => () => { copy(data); };

  render() {
    if (!this.props.active) return null;
    return (
      <Popup active={this.props.active} onClose={this.hidePopup}>
        <div>
          <h4>New Transaction</h4>
          <div>To <CopyButton data={this.props.popup.data.to} /></div>
          <div><input type="text" readOnly className={s.input} value={this.props.popup.data.to}></input></div>
          <div>Amount <CopyButton data={window.web3.fromWei(this.props.popup.data.value).toString()} /></div>
          <div><input type="text" readOnly className={s.input} value={window.web3.fromWei(this.props.popup.data.value).toString()}></input></div>
          <div>Gas <CopyButton data={this.props.popup.data.gas} /></div>
          <div><input type="text" readOnly className={s.input} value={this.props.popup.data.gas}></input></div>
          <div>Data (Important) <CopyButton data={this.props.popup.data.data} /></div>
          <div><textarea className={s.input} rows="4" readOnly value={this.props.popup.data.data}></textarea></div>
          <div>
            <div>Copy the values above to your ethereum wallet</div>
            <div> or</div>
            <div>
              <Button
                inline
                text="Send via Web3 (Metamask/Mist)"
                onClick={this.sendTransaction}
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
