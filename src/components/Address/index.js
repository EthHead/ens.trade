import React from 'react';
import s from './styles.css';
import Ethereum from '../Ethereum';
import * as ENSTrade from '../ENSTrade';

const Address = (addr) => {
  const checkSum = window.web3.toChecksumAddress(addr);
  const address = addr ? checkSum : '(none)';
  const smallAddress = addr ? `${checkSum.substring(0, 7)}..${checkSum.slice(-5)}` : '(none)';
  return (
    <span>
      <a
        href={`https://${Ethereum.getNetwork() === 'mainnet' ? '' : 'kovan'}.etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={s.largeAddress}>
          {address} {addr === ENSTrade.getAddress() ? '(ens.trade)' : null}
        </span>
        <span className={s.smallAddress}>
          {smallAddress} {addr === ENSTrade.getAddress() ? '(ens.trade)' : null}
        </span>
      </a>
    </span>
  );
};

export default Address;
