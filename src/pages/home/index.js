import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import Layout from '../../components/Layout';
import s from './styles.css';
import Link from '../../components/Link';
import Address from '../../components/Address';
import Ethereum from '../../components/Ethereum';
import * as ENSTrade from '../../components/ENSTrade';
import actions from '../../actions';
// import store from '../store';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      sortBy: 'id',
      sortDir: 'asc',
      sortedRecords: [],
    };
  }

  updateRecords() {
    this.props.dispatch(actions.ethereum.updateRecords());
  }

  componentDidMount() {
    document.title = "ens.trade - Buy and sell ethereum names";
    //if (!Ethereum.initalized) {
    window.actions = actions;
    //}
    window.ethereum = Ethereum;
    window.ENSTrade = ENSTrade;

    if (!ENSTrade.getRecords().length) {
      this.updateRecords();
    } else {
      this.sortRecords()();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ethereum.fetched) {
      if (!nextProps.records.fetching && !nextProps.records.fetched && !nextProps.records.fetchingError) {
        this.updateRecords();
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
          sortedRecords.sort((a, b) => a.name > b.name);
        } else {
          sortedRecords.sort((a, b) => a.name < b.name);
        }
      } else if (this.state.sortBy === 'id') {
        if (this.state.sortDir === 'asc') {
          sortedRecords.sort((a, b) => a.id > b.id);
        } else {
          sortedRecords.sort((a, b) => a.id < b.id);
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
    this.setState({
      sortBy: 'id',
      sortDir: 'asc',
    });
    this.updateRecords();
  }

  render() {
    window.Address = Address;
    return (
      <Layout className={s.content}>
        <input type="text" className={s.filter} onChange={this.filterChange} placeholder="search" />
        <table className={s.namesTable}>
          <thead>
            <tr>
              <td>
                <span className={s.sortBy} onClick={this.setSort('name')} data-tip data-for="sortByName">
                  Name
                </span>
                <ReactTooltip id="sortByName">
                  <span>Sort by name</span>
                </ReactTooltip>
                {!this.props.records.fetching ?
                  <span>
                    <img
                      onClick={this.refresh}
                      className={s.refreshImg}
                      src="/images/refresh.svg"
                      alt="refresh"
                      data-tip
                      data-for="nameRefresh"
                    />
                    <ReactTooltip id="nameRefresh">
                      <span>Refresh</span>
                    </ReactTooltip>
                  </span>
                :
                  <img
                    className={`${s.refreshImg} ${s.rotating}`}
                    src="/images/refresh.svg"
                    alt="loading"
                  />}
              </td>
              <td>
                <span className={s.sortBy} onClick={this.setSort('price')} data-tip data-for="sortByPrice">
                  Instant Buy Price
                </span>
                <ReactTooltip id="sortByPrice">
                  <span>Sort by price</span>
                </ReactTooltip>
              </td>
            </tr>
          </thead>
          <tbody>
          {!this.state.filter && !this.state.sortedRecords.length ?
            <tr>
              <td>{this.props.records.fetching ? <span>Fetching...</span> : <span>No records found</span>}</td>
            </tr>
          : null}
          {this.state.sortedRecords.filter(
            record => `${record.name}.eth`.includes(this.state.filter.split('.')[0]),
          ).map(record =>
            <tr key={record.hash}>
              <td>
                <Link
                  to={`/${record.name}`}
                  className={s.name}
                  data-tip
                  data-for={`view${record.name}`}
                >{record.name}.eth</Link>
                <ReactTooltip id={`view${record.name}`}>
                  <span>View {record.name}.eth</span>
                </ReactTooltip>
              </td>
              <td>{record.buyPriceETH} ether</td>
            </tr>,
          )}
          {this.showDummyName() ?
            <tr>
              <td><Link to={`/${this.state.filter.split('.')[0]}`}>{this.state.filter.split('.')[0]}.eth</Link></td>
              <td>Not for sale</td>
            </tr>
           : null}
           {this.props.records.totalRecords && this.props.records.fetching ?
             <tr>
               <td>
                 <span className={s.fetching}>
                   (Fetching {this.props.records.records.length} / {this.props.records.totalRecords})
                  </span>
               </td>
               <td/>
             </tr>
            : null}
            {this.props.records.fetched ?
              <tr>
                <td>
                  <span className={s.fetching}>
                    {this.state.sortedRecords.length} records found
                  </span>
                </td>
                <td/>
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
