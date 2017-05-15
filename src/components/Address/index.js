import React from 'react';

import Ethereum from '../Ethereum';
import * as ENSTrade from '../ENSTrade';

const Address = (addr) => {
  const address = addr ? window.web3.toChecksumAddress(addr) : '(none)';
  return (
    <span>
      <a
        href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
      >{address}</a> {addr === ENSTrade.getAddress() ? '(ens.trade)' : null}</span>
  );
};

export default Address;
