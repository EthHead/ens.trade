const Web3 = require('web3');
const jsonfile = require('jsonfile');

const web3 = new Web3();

const network = 'kovan'; // kovan || mainnet

const abi = [{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getRecordOffers","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalRecordsTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalValueTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumOfferPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"}],"name":"getOffer","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"deList","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_message","type":"string"}],"name":"newOffer","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getBuyPriceAndPreviousRecord","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"},{"name":"_offerValue","type":"uint256"}],"name":"acceptOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_buyPrice","type":"uint256"},{"name":"_message","type":"string"}],"name":"newListing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_string","type":"string"}],"name":"sha","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"recordsCurrentlyListed","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"reclaim","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"getDeedInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_minimumOfferPrice","type":"uint256"}],"name":"setMinimumOfferPrice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRecord","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getFullRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_registrarAddress","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TradeComplete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"}],"name":"OfferCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"buyPrice","type":"uint256"}],"name":"ListingCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"}],"name":"ListingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"to","type":"address"}],"name":"RecordReclaimed","type":"event"}];

const mainnetAddress = '0x0000000000000000000000000000000000000000';
const kovanAddress = '0xdbf71dd64a6a20ca9f2fdd36b46a584850979112';
const address = (network === 'mainnet' ? mainnetAddress : kovanAddress);

const zeroBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const zeroAddress = '0x0000000000000000000000000000000000000000';

web3.setProvider(new web3.providers.HttpProvider(`https://${network === 'mainnet' ? '' : 'kovan.'}infura.io/NEefAs8cNxYfiJsYCQjc`));
const contract = web3.eth.contract(abi).at(address);

function updateRecords() {
  let totalRecords = 0;
  return new Promise((resolve, reject) => {
    const records = [];
    let nextRecord;
    const getNextRecord = () => {
      contract.getRecord(nextRecord, (recordError, recordResult) => {
        const rec = {
          id: records.length,
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
          buyPriceETH: web3.fromWei(recordResult[2]).toNumber(),
        };
        records.push(rec);
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
        if (nextRecord === zeroBytes32) {
          resolve(records);
        } else {
          getNextRecord();
        }
      });
    });
  });
}

function go() {
  updateRecords()
  .then((result) => {
    const file = '../public/records.json';

    jsonfile.writeFile(file, result, (err, res) => {
      console.error(err, res);
      setTimeout(() => go(), 10000);
    });
  });
}

go();
