import React from 'react';
import ethereumjsAbi from 'ethereumjs-abi';
import * as ENSTrade from '../ENSTrade';
import Address from '../Address';
import actions from '../../actions';
import Button from '../Button';
import s from './styles.css';

class OfferList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
    };
  }

  acceptOffer = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'acceptOffer(bytes32,address,uint256)',
        this.props.hash,
        this.props.from,
        this.props.value.toString(),
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.acceptOffer(this.props.record.entry.deedAddress, offerAddress, offerValue));
  }

  cancelOffer = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'cancelOffer(bytes32)',
        this.props.hash,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.cancelOffer(this.props.record.entry.deedAddress));
  }

  showMessage = (e) => {
    e.preventDefault();
    this.setState({ showMessage: true });
  }

  render() {

    const messageLines = this.props.message.split('\n');
    const firstLine = messageLines[0].substring(0, 32);
    console.log(messageLines);
    return (
      <tr key={this.props.from}>
        <td className={s.offerAmount}>{window.web3.fromWei(this.props.value).toString()} ETH</td>
        <td className={s.offerInfo}>
          <div>{Address(this.props.from)}</div>
          {!this.state.showMessage ?
            <div>{messageLines.length > 1 ?
              <span>{firstLine}.. <a href="javascript:void(0)" onClick={this.showMessage}>(show more)</a></span>
            : null}
            </div>
          : null}
          {this.state.showMessage || messageLines.length <= 1 ?
            <div>
              {messageLines.map((item, key) => {
                return (
                  <span key={key} className={s.messageLine}>
                    {item}
                    <br />
                  </span>
                )
              })}
            </div>
          : null}
        </td>
        <td>
          <Button
            text="Accept"
            sideText=""
            onClick={this.acceptOffer}
            tip="You must own this name to accept this offer"
            noBackground
          />
        </td>
        <td>
          <Button
            text="Cancel"
            sideText=""
            onClick={this.cancelOffer}
            tip="You must have placed this offer to cancel it"
            noBackground
          />
        </td>
      </tr>
    );
  }
}


export default OfferList;
