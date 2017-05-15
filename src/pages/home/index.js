import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import Layout from '../../components/Layout';
import s from './styles.css';
import Link from '../../components/Link';

import Ethereum from '../../components/Ethereum';
import * as ENSTrade from '../../components/ENSTrade';
import actions from '../../actions';
// import store from '../store';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      sortBy: 'price',
      sortDir: 'asc',
      sortedRecords: [],
    };
  }

  componentDidMount() {
    document.title = "ens.trade - Buy and sell ethereum names";
    //if (!Ethereum.initalized) {
    window.actions = actions;
    //}
    window.ethereum = Ethereum;
    window.ENSTrade = ENSTrade;

    if (!ENSTrade.getRecords().length) {
      this.props.dispatch(actions.ethereum.updateRecords());
    } else {
      this.sortRecords()();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ethereum.fetched) {
      if (!nextProps.records.fetching && !nextProps.records.fetched && !nextProps.records.fetchingError) {
        this.props.dispatch(actions.ethereum.updateRecords());
      }
    }
    this.sortRecords()();
  }

  setSort = (sortBy) => {
    return () => {
      const sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
      this.setState({ sortBy, sortDir }, () => {
        this.sortRecords()();
      });
    };
  }

  sortRecords = () => {
    return () => {
      const sortedRecords = ENSTrade.getRecords();
      if (this.state.sortBy === 'name') {
        //console.log('wtf',window.web3.fromWei(sortedRecords[0].buyPrice).toNumber());
        if (this.state.sortDir === 'asc') {
          sortedRecords.sort((a, b) => a.name < b.name);
        } else {
          sortedRecords.sort((a, b) => a.name > b.name);
        }
      } else {
        if (this.state.sortDir === 'asc') {
          sortedRecords.sort((a, b) => {
            return a.buyPriceETH > b.buyPriceETH;
          });
        } else {
          sortedRecords.sort((a, b) => a.buyPriceETH < b.buyPriceETH);
        }
      }
      this.setState({ sortedRecords });
    };
  }

  filterChange = (e) => {
    this.setState({
      filter: e.target.value.toLowerCase(),
    });
  }

  showDummyName = () => {
    if (!this.state.filter) return false;
    for (let i = 0; i < this.state.sortedRecords.length; i += 1) {
      if (this.state.sortedRecords[i].name === this.state.filter) {
        return false;
      }
    }
    return true;
  }

  refresh = () => {
    this.props.dispatch(actions.ethereum.updateRecords());
  }

  render() {
    const id = `button${Math.random()}`;
    return (
      <Layout className={s.content}>
        <input type="text" onChange={this.filterChange} placeholder="filter" />
        <h4>
          Names for sale
          {this.props.records.fetching ?
            <span className={s.fetching}>
              (Fetching {!this.props.records.totalRecords ?
                <span>...</span>
              : <span>{this.props.records.records.length} / {this.props.records.totalRecords}</span>
              })
            </span>
          :
            <span>
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
            </span>
          }
        </h4>
        <table>
          <thead>
            <tr>
              <td onClick={this.setSort('name')}>Name</td>
              <td onClick={this.setSort('price')}>Sale Price</td>
              <td>Deed Address</td>
            </tr>
          </thead>
          <tbody>
          {!this.state.filter && !this.state.sortedRecords.length ?
            <tr>
              <td>{this.props.records.fetching ? <span>Fetching</span> : <span>No records found</span>}</td>
            </tr>
          : null}
          {this.state.sortedRecords.filter(
            record => `${record.name}.eth`.includes(this.state.filter.split('.')[0]),
          ).map(record =>
            <tr key={record.hash}>
              <td><Link to={`/record/${record.name}`}>{record.name}.eth</Link></td>
              <td>{record.buyPriceETH} ether</td>
              <td><a href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${record.hash}`} target="_blank" rel="noopener noreferrer">{record.hash}</a></td>
            </tr>,
          )}
          {this.showDummyName() ?
            <tr>
              <td><Link to={`/record/${this.state.filter.split('.')[0]}`}>{this.state.filter.split('.')[0]}.eth</Link></td>
              <td>Not for sale</td>
              <td />
            </tr>
           : null}
          </tbody>
        </table>
      </Layout>
    );
  }

}

function mapStateToProps(store) {
  window.store = store;
  return {
    ethereum: store.ethereum,
    records: store.records,
    dispatch: store.dispatch,
  };
}

export default connect(mapStateToProps)(HomePage);
