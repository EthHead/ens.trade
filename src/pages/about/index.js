import React from 'react';
import Layout from '../../components/Layout';

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <h4>What is ens.trade?</h4>
        <p><b>ens.trade</b> is a completely open source dapp (Decentralized app) built with smart contracts.<br />
        It uses the power of the Ethereum network to trade ENS names for ether without requiring any trust from either party.
        </p>
        <h4>How does it work?</h4>
        <p>Sellers can send their ENS names to the <a href="https://github.com/EthHead/ens.trade/blob/master/public/contracts/ENSTrade.sol" target="_blank" rel="noopener noreferrer">ens.trade smart contract</a> and set up a listing.
        Names owned by <b>ens.trade</b> can only be reclaimed by the original seller or are transferred if an offer is placed that the seller deems high enough.<br />
        At no point in time do <b>ens.trade</b> staff have access to any ENS names or ether.
        </p>
        <h4>Are there any fees?</h4>
        <p>
        Listing: Free<br />
        Creating offers: Free<br />
        Accepting offers: 1% of accepted value<br />
        </p>
        <h4>I&#39;m scared, can I test it out first?</h4>
        <p>
        <b>ens.trade</b> is available on the kovan testnet. You can access it using the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">metamask chrome plugin</a>
        </p>
        <h4>Can I use my ledger nano S or trezor with it?</h4>
        <p>
        Yes! Simply copy the transaction data into compatible wallet software such as <a href="https://www.myetherwallet.com/" target="_blank" rel="noopener noreferrer">MyEtherWallet</a>
        </p>
        <h4>Where can I view the source?</h4>
        <p>
        All of the source code is available on our <a href="https://github.com/EthHead/ens.trade" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </Layout>
    );
  }
}

export default About;
