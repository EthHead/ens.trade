import ethereumjsAbi from 'ethereumjs-abi';

import Ethereum from '../Ethereum';

// 0x528596380eead3b76ef73447f27995af8909c086

// RINKEBY
// ens 0x5351b94cecc87b5b6b55075491fb4a897203a59e
// ensTrade 0x9b1a5dfe219e43517b150a7eef0d973a8dd9f339

//eslint-disable-next-line
const abi = [{"constant":true,"inputs":[],"name":"registrarAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"},{"name":"_offerAddress","type":"address"},{"name":"_offerValue","type":"uint256"}],"name":"acceptOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"},{"name":"_message","type":"string"}],"name":"newOffer","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"totalRecordsTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"deList","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalValueTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumOfferPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"getRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_buyPrice","type":"uint256"},{"name":"_message","type":"string"}],"name":"newListing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_string","type":"string"}],"name":"sha","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"getRecordOffers","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"recordsCurrentlyListed","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"cancelOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_deedAddress","type":"address"},{"name":"_offerAddress","type":"address"}],"name":"getOffer","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_minimumOfferPrice","type":"uint256"}],"name":"setMinimumOfferPrice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRecord","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"reclaim","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_registrarAddress","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"tradeComplete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"offerCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"from","type":"address"}],"name":"offerCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"buyPrice","type":"uint256"}],"name":"listingCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"from","type":"address"}],"name":"listingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deedAddress","type":"address"},{"indexed":false,"name":"to","type":"address"}],"name":"recordReclaimed","type":"event"}];

let address;
const mainnetAddress = '';
const kovanAddress = '0xb99b6ef29597fa91c66542c55f9195fac15ab9cc';

let contract;

const records = [];

const zero = '0x0000000000000000000000000000000000000000';

export function getAddress() {
  return address;
}

export function getRecords() {
  return records;
}

export function updateRecords() {
  return new Promise((resolve, reject) => {
    let nextRecord;
    const getNextRecord = () => {
      contract.getRecord(nextRecord, (recordError, recordResult) => {
        const rec = {
          listed: recordResult[0],
          deedAddress: nextRecord,
          name: recordResult[1],
          buyPrice: recordResult[2],
          nextRecord: recordResult[3],
          previousRecord: recordResult[4],
        };
        records.push(rec);
        if (rec.previousRecord !== zero) {
          nextRecord = rec.previousRecord;
          if (nextRecord === zero) {
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
    contract.lastRecord((err, result) => {
      nextRecord = result;
      if (nextRecord === zero) {
        resolve(records);
      } else {
        getNextRecord();
      }
    });
  });
}

export function getOffers(deedAddress) {
  return new Promise((resolve, reject) => {
    let nextOffer;
    const offers = [];
    function getNextOffer() {
      contract.getOffer(deedAddress, nextOffer, (err, result) => {
        offers.push({
          address: nextOffer,
          nextOffer: result[0],
          previousOffer: result[1],
          value: result[2],
          message: result[3],
        });
        if (result[1] !== zero) {
          nextOffer = result[1];
          getNextOffer();
        } else {
          resolve(offers);
        }
      });
    }
    contract.getRecordOffers(deedAddress, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      nextOffer = result[0];
      if (nextOffer === zero) {
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

export function newOffer(deedAddress, message, value) {
  return new Promise((resolve, reject) => {
    contract.newOffer(deedAddress, message, { value }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function acceptOffer(deedAddress, offerAddress, offerValue) {
  return new Promise((resolve, reject) => {
    contract.acceptOffer(deedAddress, offerAddress, offerValue, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function cancelOffer(deedAddress) {
  return new Promise((resolve, reject) => {
    contract.cancelOffer(deedAddress, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function deList(deedAddress) {
  return new Promise((resolve, reject) => {
    contract.deList(deedAddress, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function reclaim(deedAddress) {
  return new Promise((resolve, reject) => {
    contract.reclaim(deedAddress, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function getLastRecord(callback) {
  contract.lastRecord((err, result) => {
    callback(err, result);
  });
}

export function getRecord(record) {
  console.log('Fetching record', record);
  return new Promise((resolve, reject) => {
    contract.getRecord(record, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        deedAddress: record,
        listed: result[0],
        name: result[1],
        buyPrice: result[2],
        nextRecord: result[3],
        previousRecord: result[4],
        message: result[5],
      });
    });
  });
}

export function getRecordOffers(offer, callback) {
  contract.getRecordOffers(offer, (err, result) => {
    callback(result);
  });
}

export function getOffer(offer, callback) {
  contract.getOffer(offer, (err, result) => {
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
