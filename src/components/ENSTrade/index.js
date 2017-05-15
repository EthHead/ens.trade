import ethereumjsAbi from 'ethereumjs-abi';

import Ethereum from '../Ethereum';

import store from '../../store';
import actions from '../../actions';

// 0x528596380eead3b76ef73447f27995af8909c086

// RINKEBY
// ens 0x5351b94cecc87b5b6b55075491fb4a897203a59e
// ensTrade 0x9b1a5dfe219e43517b150a7eef0d973a8dd9f339

//eslint-disable-next-line
const abi = [{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getRecordOffers","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalRecordsTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalValueTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumOfferPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"}],"name":"getOffer","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"deList","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_message","type":"string"}],"name":"newOffer","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getBuyPriceAndPreviousRecord","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"},{"name":"_offerValue","type":"uint256"}],"name":"acceptOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_buyPrice","type":"uint256"},{"name":"_message","type":"string"}],"name":"newListing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_string","type":"string"}],"name":"sha","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"recordsCurrentlyListed","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"reclaim","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_minimumOfferPrice","type":"uint256"}],"name":"setMinimumOfferPrice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRecord","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getFullRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_registrarAddress","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TradeComplete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"}],"name":"OfferCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"buyPrice","type":"uint256"}],"name":"ListingCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"}],"name":"ListingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"to","type":"address"}],"name":"RecordReclaimed","type":"event"}];

let address;
const mainnetAddress = '0x0000000000000000000000000000000000000000';
const kovanAddress = '0x59e611e14e8723cb3cdcd9cea6f274fb57d0d5a4';

let contract;

const records = [];

const zeroBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const zeroAddress = '0x0000000000000000000000000000000000000000';

export function getAddress() {
  return address;
}

export function getRecords() {
  return records;
}

export function updateRecords() {
  let totalRecords = 0;
  return new Promise((resolve, reject) => {
    records.length = 0;
    let nextRecord;
    const getNextRecord = () => {
      contract.getRecord(nextRecord, (recordError, recordResult) => {
        const rec = {
          listed: recordResult[0],
          hash: nextRecord,
          name: recordResult[1],
          buyPrice: recordResult[2],
          nextRecord: recordResult[3],
          previousRecord: recordResult[4],
          message: recordResult[5],
          // owner: recordResult[6],
          // previousOwner: recordResult[7],
          // value: recordResult[8],
          // creationDate: recordResult[9],
          buyPriceETH: window.web3.fromWei(recordResult[2]).toNumber(),
        };
        records.push(rec);
        store.dispatch(actions.ethereum.recordsUpdated({
          totalRecords,
          records,
        }));
        if (rec.previousRecord !== zeroBytes32) {
          nextRecord = rec.previousRecord;
          if (nextRecord === zeroBytes32) {
            resolve(records);
          } else {
            getNextRecord();
          }
        } else {
          resolve(records);
          // callback(records);
        }
      });
    };
    contract.recordsCurrentlyListed((listedErr, listedResult) => {
      totalRecords = listedResult;
      //store.dispatch(actions.ethereum.recordsCurrentListedUpdated(listedResult));
      contract.lastRecord((err, result) => {
        nextRecord = result;
        if (nextRecord === zeroAddress) {
          resolve(records);
        } else {
          getNextRecord();
        }
      });
    });
  });
}

export function getOffers(hash) {
  return new Promise((resolve, reject) => {
    let nextOffer;
    const offers = [];
    function getNextOffer() {
      contract.getOffer(hash, nextOffer, (err, result) => {
        offers.push({
          address: nextOffer,
          nextOffer: result[0],
          previousOffer: result[1],
          value: result[2],
          message: result[3],
        });
        if (result[1] !== zeroAddress) {
          nextOffer = result[1];
          getNextOffer();
        } else {
          resolve(offers);
        }
      });
    }
    contract.getRecordOffers(hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      nextOffer = result[0];
      if (nextOffer === zeroAddress) {
        resolve(offers);
      } else {
        getNextOffer();
      }
    });
  });
}

export function sendTransaction() {

}

export function newListing(name, buyPrice, message) {
  return new Promise((resolve, reject) => {
    contract.newListing(name, buyPrice, message, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function newOffer(hash, message, value) {
  return new Promise((resolve, reject) => {
    contract.newOffer(hash, message, { value }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function acceptOffer(hash, offerAddress, offerValue) {
  return new Promise((resolve, reject) => {
    contract.acceptOffer(hash, offerAddress, offerValue, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function cancelOffer(hash) {
  return new Promise((resolve, reject) => {
    contract.cancelOffer(hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function deList(hash) {
  return new Promise((resolve, reject) => {
    contract.deList(hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function reclaim(hash) {
  return new Promise((resolve, reject) => {
    contract.reclaim(hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function getRecordsListedCount(callback) {
  contract.recordsCurrentlyListed((err, result) => {
    callback(err, result);
  });
}

export function getLastRecord(callback) {
  contract.lastRecord((err, result) => {
    callback(err, result);
  });
}

export function getRecord(hash) {
  console.log('Fetching record', hash);
  return new Promise((resolve, reject) => {
    contract.getRecord(hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        hash,
        listed: result[0],
        name: result[1],
        buyPrice: result[2],
        nextRecord: result[3],
        previousRecord: result[4],
        message: result[5],
        // owner: result[6],
        // previousOwner: result[7],
        // value: result[8],
        // creationDate: result[9],
        buyPriceETH: window.web3.fromWei(result[2]).toNumber(),
      });
    });
  });
}

export function getRecordOffers(offer, callback) {
  contract.getRecordOffers(offer, (err, result) => {
    callback(result);
  });
}

export function getOffer(hash, offerAddress, callback) {
  contract.getOffer(hash, (offerAddress, result) => {
    callback(err, result);
  });
}

export function init() {
  return new Promise((resolve) => {
    address = Ethereum.getNetwork() === 'mainnet' ? mainnetAddress : kovanAddress;
    contract = window.web3.eth.contract(abi).at(address);
    window.ENScontract = contract;
    window.ethereumjsAbi = ethereumjsAbi;
    window.wtf =
    resolve();
  });
}

export default () => {

};
