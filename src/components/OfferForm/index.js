import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

class OfferForm extends React.Component {

  static propTypes = {
    deedAddress: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      offerValue: undefined,
      offerMessage: undefined,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.ethereum.newOffer(
      this.props.deedAddress,
      this.state.offerMessage,
      window.web3.toWei(this.state.offerValue).toString(),
    ));
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
        <input id="offerValue" type="number" step="any" onChange={this.changeValue} />
        <label htmlFor="offerMessage">Message (optional)</label>
        <input id="offerMessage" type="text" onChange={this.changeMessage} />
        <button type="submit">Make Offer</button>
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
