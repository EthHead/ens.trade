import React from 'react';
import { connect } from 'react-redux';
import ethereumjsAbi from 'ethereumjs-abi';
import ReactTooltip from 'react-tooltip';
import Layout from '../../components/Layout';
import s from './styles.css';
import Button from '../../components/Button';
import actions from '../../actions';
import Ethereum from '../../components/Ethereum';
import * as ENSTrade from '../../components/ENSTrade';
import OfferForm from '../../components/OfferForm';
// import store from '../store';

const zero = '0x0000000000000000000000000000000000000000';

const lockTime = 31556926000 + 432000000; // One year and five days

class HomePage extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.route.params.name.toLowerCase(),
      buyPrice: 0,
      message: '',
    };
  }

  componentDidMount() {
    if (!this.props.ethereum.fetched) return;
    this.props.dispatch(actions.ethereum.getName(this.props.route.params.name.toLowerCase()));
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.ethereum.fetched) return;
    if (this.state.name !== nextProps.route.params.name.toLowerCase()) {
      this.setState({ name: nextProps.route.params.name.toLowerCase() });
      nextProps.dispatch(actions.ethereum.getName(nextProps.route.params.name.toLowerCase()));
    }
    if (nextProps.record.fetched) {
      if (nextProps.offers.fetched || nextProps.offers.fetching || nextProps.offers.fetchingError) return;
      nextProps.dispatch(actions.ethereum.getOffers(nextProps.record.entry.deedAddress));
      return;
    }
    if (nextProps.record.fetching || nextProps.record.fetchingError ) return;
    nextProps.dispatch(actions.ethereum.getName(nextProps.route.params.name.toLowerCase()));
  }

  transferToENSTrade = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: Ethereum.getENSAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode('transfer(bytes32,address)',
        window.web3.sha3(this.props.route.params.name.toLowerCase()),
        ENSTrade.getAddress(),
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.transferToENSTrade(this.props.route.params.name));
  }

  newListing = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'newListing(string,uint256,string)',
        this.props.route.params.name.toLowerCase(),
        window.web3.toWei(this.state.buyPrice).toString(),
        this.state.message,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.newListing(this.props.route.params.name, 'email', window.web3.toWei(this.state.buyPrice).toString(), window.web3.toWei(this.state.minimumOfferPrice).toString(), this.state.message));
  }

  deList = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'deList(address)',
        this.props.record.entry.deedAddress,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.deList(this.props.record.entry.deedAddress));
  }

  reclaim = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: ENSTrade.getAddress(),
      value: 0,
      gas: 200000,
      data: ethereumjsAbi.simpleEncode(
        'reclaim(address)',
        this.props.record.entry.deedAddress,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.reclaim(this.props.record.entry.deedAddress));
  }

  acceptOffer = (offerAddress, offerValue) => {
    return () => {
      this.props.dispatch(actions.ethereum.showPopup({
        to: ENSTrade.getAddress(),
        value: 0,
        gas: 200000,
        data: ethereumjsAbi.simpleEncode(
          'acceptOffer(address,address,uint256)',
          this.props.record.entry.deedAddress,
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
        'cancelOffer(address)',
        this.props.record.entry.deedAddress,
      ).toString('hex') }));
    // this.props.dispatch(actions.ethereum.cancelOffer(this.props.record.entry.deedAddress));
  }

  isMine = (address) => {
    return true;
    // return address === window.web3.eth.accounts[0];
  }

  listOffers = () => {
    if (this.props.offers.fetching) {
      return (<div>Fetching...</div>);
    } else if (!this.props.offers.offers.length) {
      return (<div>No offers yet</div>);
    }
    return (
      <table>
        <thead>
          <tr>
            <td>Amount</td>
            <td>Address</td>
            <td />
          </tr>
        </thead>
        <tbody>
          {this.props.offers.offers.sort(
            (a, b) => a.value > b.value,
          ).map(offer =>
            <tr key={offer.address}>
              <td>{window.web3.fromWei(offer.value).toString()} ETH</td>
              <td><a href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${offer.address}`} target="_blank" rel="noreferrer noopener">{offer.address}</a></td>
              <td>
                <Button
                  text="Accept"
                  sideText=""
                  onClick={this.acceptOffer(offer.address, offer.value)}
                  active={this.isMine(this.props.record.previousOwner)}
                  tip="You must own this name to accept this offer"
                  activeTip="Accept this offer, instantly claiming the ether and transfering the name"
                  noBackground
                />
              </td>
              <td>
                <Button
                  text="Cancel"
                  sideText=""
                  onClick={this.cancelOffer}
                  active={this.isMine(offer.address)}
                  tip="You must have placed this offer to cancel it"
                  activeTip="Cancels this offer and refunds the ether"
                  noBackground
                />
              </td>
            </tr>,
          )}
        </tbody>
      </table>
    );
  }

  changeBuyPrice = (e) => {
    this.setState({ buyPrice: e.target.value });
  }
  changeMessage = (e) => {
    this.setState({ message: e.target.value });
  }

  dummyRegister = () => {
    this.props.dispatch(actions.ethereum.showPopup({
      to: Ethereum.getENSAddress(),
      value: 0,
      gas: 1000000,
      data: ethereumjsAbi.simpleEncode('fakeBid(bytes32)',
        window.web3.sha3(this.props.route.params.name),
      ).toString('hex') }));
  }

  listForm = () => {
    return (
      <form>
        <label htmlFor="buyPrice">
          <div className={s.listingHeader}>Buy Price</div>
          <div><small>Your name will be instantly sold if an offer is made of at least this amount (in ether)</small></div>
        </label>
        <input value={this.state.buyPrice} id="buyPrice" type="number" step="any" onChange={this.changeBuyPrice} />
        <label htmlFor="message">
          <div className={s.listingHeader}>Message</div>
          <div><small>(optional, eg: contact email)</small></div>
        </label>
        <input id="message" maxLength="32" value={this.state.message} type="text" onChange={this.changeMessage} />
      </form>
    );
  }

  listingData = () => {
    if (this.props.record.entry.deedAddress === zero) {
      return (
        <div>
          This name has not been registered with the ENS. <a href={`https://registrar.ens.domains/#${this.state.name}`} target="_blank" rel="noreferrer noopener">Register it here</a>
          {Ethereum.getNetwork() === 'kovan' ?
            <div className={s.dummyRegister}>
              You are on the kovan testnet.
              <Button
                text="Register this name for free with the ens.trade kovan dummy registrar"
                onClick={this.dummyRegister}
              />
            </div>
          : null}
        </div>
      )
    } else if (this.props.record.ownedByENSTrade) {
      if (!this.props.record.record.listed) {
        return (
          <div>
            <h4>This name has been transferred to ens.trade but has not yet been listed</h4>
            <div className={this.isMine(this.props.record.previousOwner) ? s.listBg : null}>
              {this.isMine(this.props.record.previousOwner) ? this.listForm() : null}
              <Button
                text="List Name"
                sideText=""
                onClick={this.newListing}
                active={this.isMine(this.props.record.previousOwner)}
                tip="You must own this name to list it"
                noBackground
              />
            </div>
            <div>
              <Button
                text="Reclaim this name and regain ownership of it"
                sideText=""
                onClick={this.reclaim}
                active={this.isMine(this.props.record.previousOwner)}
                tip="You must own this name to reclaim it"
              />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <h4>This name is for sale! Buy it instantly for {window.web3.fromWei(this.props.record.record.buyPrice).toString()} ether</h4>
            <div>.. or make a custom offer</div>
            <div>
              <h4>Offers</h4>
              {this.listOffers()}
              <OfferForm deedAddress={this.props.record.entry.deedAddress} buyPrice={window.web3.fromWei(this.props.record.record.buyPrice).toString()}/>
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        <h4>This name is not for sale</h4>
        <Button
          text="Transfer"
          sideText="Transfer this name to the ens.trade smart contract to list it for sale. It cannot be bought until you set your minimum sale price. You can reclaim it anytime."
          onClick={this.transferToENSTrade}
          active={this.isMine(this.props.record.owner)}
          tip="You must own this name to transfer it"
        />
      </div>
    );
  }

  refresh = () => {
    this.props.dispatch(actions.ethereum.getName(this.props.route.params.name.toLowerCase()));
  }

  render() {
    if (!this.props.ethereum.fetched) {
      return (
        <Layout className={s.content}>
          Initializing ...
        </Layout>
      );
    }
    if (this.props.record.fetching) {
      return (
        <Layout className={s.content}>
          Fetching {this.state.name}.eth ...
        </Layout>
      );
    }
    const id = `button${Math.random()}`;
    return (
      <Layout className={s.content}>
        <h3>
          <div className={s.title}>
            {this.state.name}.eth
            <img
              onClick={this.refresh}
              className={s.refreshImg}
              src="/images/refresh.svg"
              alt="refresh"
              data-tip
              data-for={id}
            />
            <ReactTooltip id={id}>
              <span>Refresh</span>
            </ReactTooltip>
          </div>
        </h3>
        <hr />
        {this.listingData()}
        {this.props.record.entry.deedAddress !== zero ?
          <div>
            <h4>Information</h4>
            <div>Deed Address: <a href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${this.props.record.entry.deedAddress}`} target="_blank">{this.props.record.entry.deedAddress}</a></div>
            <div>Owner: <a href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${this.props.record.owner}`} target="_blank">{this.props.record.owner}</a> {this.props.record.owner === ENSTrade.getAddress() ? '(ens.trade)' : null}</div>
            <div>Previous Owner: <a href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${this.props.record.previousOwner}`} target="_blank">{this.props.record.previousOwner}</a></div>
            <div>Locked value: {this.props.record.value.toString()} (Unlocks {new Date((this.props.record.creationDate * 1000) + lockTime).toString()})</div>
            <div>Sale Price: {window.web3.fromWei(this.props.record.record.buyPrice).toString()} ether</div>
            <div>Seller&#39;s Message: {(this.props.record.record.message ? this.props.record.record.message : '(none)')}</div>
          </div>
        : null }
        {(this.props.record.ownedByENSTrade && this.props.record.record.listed ?
          <div>
            <h4>Other Options</h4>
            <div>
              <Button
                text="Delist this name from sale"
                sideText=""
                onClick={this.deList}
                active={this.isMine(this.props.record.previousOwner)}
                tip="You must own this name to delist it"
              />
            </div>
            <div>
              <Button
                text="Reclaim ownership of this name and remove it from sale"
                sideText=""
                onClick={this.reclaim}
                active={this.isMine(this.props.record.previousOwner)}
                tip="You must own this name to reclaim it"
              />
            </div>
          </div>
        : null) }
      </Layout>
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

export default connect(mapStateToProps)(HomePage);
