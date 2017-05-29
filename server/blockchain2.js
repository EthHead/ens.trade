'use strict';
const Web3 = require('web3');
const jsonfile = require('jsonfile');

const web3 = new Web3();

const network = 'kovan'; // kovan || mainnet

const abi = [{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalRecordsTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalValueTraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumOfferPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"}],"name":"getOffer","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"deList","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_message","type":"string"}],"name":"newOffer","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_offerAddress","type":"address"},{"name":"_offerValue","type":"uint256"}],"name":"acceptOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_buyPrice","type":"uint256"},{"name":"_message","type":"string"}],"name":"newListing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_string","type":"string"}],"name":"sha","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"recordsCurrentlyListed","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"reclaim","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"getDeedInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_minimumOfferPrice","type":"uint256"}],"name":"setMinimumOfferPrice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"cancelOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getFullRecord","outputs":[{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_registrarAddress","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TradeComplete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"value","type":"uint256"},{"indexed":false,"name":"message","type":"string"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"from","type":"address"}],"name":"OfferCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"buyPrice","type":"uint256"}],"name":"ListingCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"from","type":"address"}],"name":"ListingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"to","type":"address"}],"name":"RecordReclaimed","type":"event"}]
;

const mainnetAddress = '0x0000000000000000000000000000000000000000';
const kovanAddress = '0x9ffe35025856e80dc6c7fbe520e8904b9e701b9d'; // 0x9ffe35025856e80dc6c7fbe520e8904b9e701b9d
const address = (network === 'mainnet' ? mainnetAddress : kovanAddress);

const zeroBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const zeroAddress = '0x0000000000000000000000000000000000000000';

//web3.setProvider(new web3.providers.HttpProvider(`https://${network === 'mainnet' ? '' : 'kovan.'}infura.io/NEefAs8cNxYfiJsYCQjc`));
web3.setProvider(new web3.providers.HttpProvider('http://172.31.25.162:8545/'));
const contract = web3.eth.contract(abi).at(address);

function updateRecordsFromEvents() {
  console.log('updating records');
  return new Promise((resolve, reject) => {
    contract.allEvents({ fromBlock: 0, toBlock: 'latest' }).get(
      (err, result) => {
        // console.log(err, result);
        const records = [];
        const offers = {};
        for (let i = 0; i < result.length; i += 1) {
          const ev = result[i];
          console.log(ev.event);
          if (ev.event === 'ListingCreated') {
            let removed = false;
            const hash = web3.sha3(ev.args.name);
            for (let e = i + 1; e < result.length; e += 1) {
              const r = result[e];
              if (r.args.hash === hash) {
                if (r.event === 'ListingRemoved' || r.event === 'TradeComplete') {
                  removed = true;
                  break;
                }
              }
            }
            if (!removed) {
              const rec = {
                name: ev.args.name,
                id: records.length,
                from: ev.args.from,
                hash: ev.args.hash,
                buyPrice: ev.args.buyPrice,
                offers: {},
                buyPriceETH: web3.fromWei(ev.args.buyPrice).toNumber(),
              };
              records.push(rec);
            }
          } else if (ev.event === 'OfferCreated') {
            let removed = false;
            const hash = ev.args.hash;
            for (let e = i + 1; e < result.length; e += 1) {
              const r = result[e];
              if (r.args.hash === hash) {
                if (r.event === 'OfferCancelled' || r.event === 'TradeComplete') {
                  removed = true;
                  break;
                }
              }
            }
            if (!removed) {
              const offer = {
                hash: ev.args.hash,
                from: ev.args.from,
              };
              if (!offers[hash]) {
                offers[hash] = [];
              }
              offers[hash].push(offer);
            }
          }
        }

        console.log('resolve');
        resolve(records);
      }
    );
  });
}

function go() {
  updateRecordsFromEvents()
  .then((result) => {
    console.log('Result received', result);
    const file = '../public/records.json';
    jsonfile.writeFile(file, result, (err, res) => {
      console.log('File updated');
      setTimeout(() => go(), 5000);
    });
  });
}

go();
