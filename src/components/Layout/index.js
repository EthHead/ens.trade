import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';
import SendTransaction from '../SendTransaction';

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  componentWillMount() {

  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    // ens.trade is currently in alpha. Use at your own risk and do not list high-value names
    const props = {};
    for (let key in this.props) { //eslint-disable-line
      if (key !== 'popup' && key !== 'dispatch' && key !== 'ethereum') props[key] = this.props[key];
    }
    if (!this.props.ethereum.fetched) {
      return (
        <div ref={node => (this.root = node)}>
          <div>
            <Header />
            <div className={s.alpha}>ens.trade is currently in alpha. It is only live on the kovan testnet.<br />
            Found a bug? We are paying a <a href="https://github.com/EthHead/ens.trade/issues" target="_blank" rel="noopener noreferrer">bug bounty!</a></div>
            <main>
              <div className={cx(s.content, this.props.className)}>
                Initializing...
              </div>
              <Footer />
            </main>
          </div>
        </div>
      )
    }
    if (this.props.ethereum.network !== 'kovan') {
      return (
        <div className="mdl-layout mdl-js-layout" ref={node => (this.root = node)}>
          <div className="mdl-layout__inner-container">
            <Header />
            <div className={s.alpha}>ens.trade is currently in alpha. It is only live on the kovan testnet.<br />
            Found a bug? We are paying a <a href="https://github.com/EthHead/ens.trade/issues" target="_blank" rel="noopener noreferrer">bug bounty!</a></div>
            <main className="mdl-layout__content">
              <div className={cx(s.content, this.props.className, s.center)}>
                ens.trade is currently only available on the kovan testnet
              </div>
              <Footer />
            </main>
          </div>
        </div>
      );
    }
    return (
      <div ref={node => (this.root = node)}>
        <div>
          <Header />
          <div className={s.alpha}>ens.trade is currently in alpha. It is only live on the kovan testnet.<br />
          Names are not official and are only registered with a dummy registrar.<br />
          Found a bug? We are paying a <a href="https://github.com/EthHead/ens.trade/issues" target="_blank" rel="noopener noreferrer">bug bounty!</a></div>
          <main>
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
    ethereum: str.ethereum,
    popup: str.popup,
  };
}

export default connect(mapStateToProps)(Layout);
