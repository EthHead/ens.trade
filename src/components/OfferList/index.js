import React from 'react';
import ethereumjsAbi from 'ethereumjs-abi';
import * as ENSTrade from '../ENSTrade';
import Address from '../Address';
import actions from '../../actions';
import Button from '../Button';
import s from './styles.css';
import Offer from '../Offer';

class OfferList extends React.Component {
  constructor(props) {
    super(props);
  }

  acceptOffer = (offerAddress, offerValue) => {
    return () => {
      this.props.dispatch(actions.ethereum.showPopup({
        to: ENSTrade.getAddress(),
        value: 0,
        gas: 200000,
        data: ethereumjsAbi.simpleEncode(
          'acceptOffer(bytes32,address,uint256)',
          this.props.record.entry.hash,
          offerAddress,
          offerValue.toString(),
        ).toString('hex') }));
      // this.props.dispatch(actions.ethereum.acceptOffer(this.props.record.entry.deedAddress, offerAddress, offerValue));
    };
  }

  cancelOffer = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'cancelOffer(bytes32)',
        this.props.record.entry.hash,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.cancelOffer(this.props.record.entry.deedAddress));
  }

  showMessage = (from) => {
    return (e) => {
      e.preventDefault();

    };
  }

  render() {
    if (this.props.offers.fetching) {
      return (<div>Fetching...</div>);
    } else if (!this.props.offers.offers.length) {
      return (<div>No offers yet</div>);
    }
    return (
      <table className={s.offersTable}>
        <thead>
          <tr>
            <td>Amount</td>
            <td>Address / Message</td>
            <td />
          </tr>
        </thead>
        <tbody>
          {this.props.offers.offers.sort(
            (a, b) => a.value > b.value,
          ).map(offer =>
            <Offer
              key={offer.from}
              hash={offer.hash}
              from={offer.from}
              value={offer.value}
              message={offer.message}
              dispatch={this.props.dispatch}
            />,
          )}
        </tbody>
      </table>
    );
  }
}


export default OfferList;
