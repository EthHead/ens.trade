import React from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import Link from '../Link';
import s from './Header.css';

import history from '../../history';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }
  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  submitForm = (e) => {
    e.preventDefault();
    this.props.dispatch({ redirect: `/${this.state.search.split('.')[0]}` });
  }

  onChange = (e) => {
    this.setState({
      search: e.target.value.toLowerCase(),
    });
  }

  render() {
    return (
      <header className={`${s.header}`} ref={node => (this.root = node)}>
        <div className={`mdl-layout__header-row ${s.row}`}>
          <Link className={`${s.title}`} to="/">
            <img src="/images/logo.png" className={s.logo} alt="logo" /><b>ens.trade</b>
            <div className={s.subTitle}>open source ethereum name trading via smart contracts</div>
          </Link>
          <div className="mdl-layout-spacer" />
          <div>
            <form onSubmit={this.submitForm}>
              <input className={s.search} type="text" placeholder="Search" value={this.state.search} onChange={this.onChange}/>
            </form>
          </div>
        </div>
      </header>
    );
  }

}

function mapStateToProps(store) {
  window.store = store;
  return {
    dispatch: store.dispatch,
  };
}

export default connect(mapStateToProps)(Header);
