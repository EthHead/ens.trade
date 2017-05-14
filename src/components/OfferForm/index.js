import React from 'react';
import { connect } from 'react-redux';
import ethereumjsAbi from 'ethereumjs-abi';
import * as ENSTrade from '../ENSTrade';
import Button from '../Button';
import actions from '../../actions';

class OfferForm extends React.Component {

  static propTypes = {
    deedAddress: React.PropTypes.string,
    buyPrice: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      offerValue: this.props.buyPrice,
      offerMessage: '',
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: this.state.offerValue,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'newOffer(address,string)',
        this.props.deedAddress,
        this.state.offerMessage,
      ).toString('hex') }));
    /*
    this.props.dispatch(actions.ethereum.newOffer(
      this.props.deedAddress,
      this.state.offerMessage,
      window.web3.toWei(this.state.offerValue).toString(),
    ));
    */
  }

  changeMessage = (e) => {
    this.setState({ offerMessage: e.target.value });
  }

  changeValue = (e) => {
    this.setState({ offerValue: e.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h4>Make Offer</h4>
        <label htmlFor="offerValue">Amount (in ether)</label>
        <input id="offerValue" type="number" step="any" value={this.state.offerValue} onChange={this.changeValue} />
        <label htmlFor="offerMessage">Message (optional)</label>
        <input id="offerMessage" type="text" value={this.state.offerMessage} onChange={this.changeMessage} />
        <div>Making an offer will store the ether in the ens.trade smart contract. If your offer is above the sale price, or the seller accepts, the ENS name will be instantly transferred to you</div>
        <Button text="Make Offer" type="submit" onClick={this.onSubmit} />
      </form>
    );
  }

}

function mapStateToProps(store) {
  window.store = store;
  return {
    ethereum: store.ethereum,
    records: store.records,
    record: store.record,
    offers: store.offers,
    dispatch: store.dispatch,
  };
}

export default connect(mapStateToProps)(OfferForm);
