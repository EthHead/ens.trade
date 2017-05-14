import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';
import store from '../../store';
import actions from '../../actions';
import SendTransaction from '../SendTransaction';

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  componentWillMount() {

  }

  componentDidMount() {
    store.dispatch(actions.ethereum.init());
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    // ens.trade is currently in alpha. Use at your own risk and do not list high-value names
    const props = {};
    for (let key in this.props) { //eslint-disable-line
      if (key !== 'popup' && key !== 'dispatch') props[key] = this.props[key];
    }
    return (
      <div className="mdl-layout mdl-js-layout" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container">
          <Header />
          <div className={s.alpha}>ens.trade is currently in alpha. It is only live on the kovan testnet.<br />
          Found a bug? We are paying a <a href="https://github.com/EthHead/ens.trade/issues" target="_blank" rel="noopener noreferrer">bug bounty!</a></div>
          <main className="mdl-layout__content">
            <div {...props} className={cx(s.content, this.props.className)} />
            <Footer />
          </main>
          <SendTransaction active={this.props.popup.fetched}/>
        </div>
      </div>
    );
  }
}


function mapStateToProps(str) {
  return {
    popup: str.popup,
  };
}

export default connect(mapStateToProps)(Layout);
