import ENS from 'ethereum-ens';
import Registrar from 'eth-registrar-ens';
import Web3 from 'web3';
import * as ENSTrade from '../ENSTrade';

// These get assigned at init() below
export let ens; // eslint-disable-line
export let registrar; // eslint-disable-line
export let network; // eslint-disable-line

let contract;

// eslint-disable-next-line
const abi = [{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"sealedBid","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"fakeBid","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]
;

// eslint-disable-next-line
const deedAbi = [{"constant":true,"inputs":[],"name":"creationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroyDeed","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"},{"name":"throwOnFailure","type":"bool"}],"name":"setBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"refundRatio","type":"uint256"}],"name":"closeDeed","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newRegistrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DeedClosed","type":"event"}]
;
window.deedAbi = deedAbi;

export const errors = {
  invalidNetwork: new Error('Sorry, ENS is not available on this network at the moment.'),
};

let networkId;

const ethereum = () => {
  let initialized = false;
  const subscribers = [];
  let customEnsAddress;
  let ensAddress;

  function initWeb3() {
    return new Promise((resolve, reject) => {
      if (typeof window.web3 !== 'undefined') {
        //window.web3 = new window.Web3(window.web3.currentProvider);
        // TODO: ? LocalStore.set('hasNode', true);
      } else {
        // const Web3 = require('web3');
        // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        // web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/NEefAs8cNxYfiJsYCQjc"));
        window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/NEefAs8cNxYfiJsYCQjc'));
        // TODO: ? LocalStore.set('hasNode', false);
      }
      resolve();
    });
  }

  function getDeed(hash, callback) {
    contract.entries(hash, (error, result) => {
      window.web3.eth.contract(deedAbi).at(result[1], (deedError, deedResult) => {
        console.log(deedError, deedResult);
        callback();
      });
    });
  }

  function getEntry(hash, callback) {
    contract.entries(hash, (error, result) => {
      window.web3.eth.contract(deedAbi).at(result[1], (deedError, deedResult) => {
        deedResult.owner((dError, dResult) =>{
          console.log('owner',dError, dResult);
          callback();
        });
        deedResult.previousOwner((dError, dResult) =>{
          console.log('previousOwner',dError, dResult);
          callback();
        });
        deedResult.registrar((dError, dResult) =>{
          console.log('registrar',dError, dResult);
          callback();
        });
      });
    });
  }

  function transferToENSTrade(name) {
    const hash = window.web3.sha3(name);
    return new Promise((resolve, reject) => {
      contract.transfer(hash, ENSTrade.getAddress(), (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  function getENSAddress() {
    return ensAddress;
  }

  function transfer(hash, newOwner, callback) {
    contract.transfer(hash, newOwner, (error, result) => {
      console.log(error, result);
      callback();
    });
  }

  function reportStatus(description, isReady, theresAnError) {
    console.log(description);
    subscribers.forEach(subscriber => subscriber({
      isReady,
      description,
      theresAnError,
    }));
  }

  function checkConnection() {
    reportStatus('Checking connection...');
    let attempts = 4;
    let checkInterval;

    return new Promise((resolve, reject) => {
      function check() {
        attempts -= 1;
        if (window.web3.isConnected()) {
          clearInterval(checkInterval);
          resolve(window.web3);
        } else if (attempts <= 0) {
          console.log('checking..');
          reportStatus('Ethereum network is disconnected. Awaiting connection...');
        }
      }
      checkInterval = setInterval(check, 800);
      check();
    });
  }

  function checkNetwork() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getBlock(0, (e, res) => {
        if (e) {
          return reject(e);
        }
        console.log('checkNetwork', res.hash);
        networkId = res.hash.slice(2, 8);
        switch (res.hash) {
          case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
            network = 'ropsten';
            ensAddress = '0x112234455c3a32fd11230c42e7bccd4a84e02010';
            return resolve();
          case '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177':
            network = 'rinkeby';
            ensAddress = '0x9b1a5dfe219e43517b150a7eef0d973a8dd9f339';
            return resolve();
          case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
            network = 'kovan';
            ensAddress = '0xaa562c14368f144d3092bdefaaefeaeb24c21df6';
            return resolve();
          case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
            network = 'morden';
            return reject(errors.invalidNetwork);
          case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
            network = 'main';
            ensAddress = '0x314159265dd8dbb310642f98f50c066173c1259b';
            return resolve();
            // return reject(errors.invalidNetwork);
          default:
            network = 'private';
            return reject(errors.invalidNetwork);
        }
      });
    });
  }

  function initRegistrar() {
    reportStatus('Initializing ENS registrar...');
    return new Promise((resolve, reject) => {
      try {
        ens = new ENS(window.web3, customEnsAddress || ensAddress);
        /*registrar = new Registrar(window.web3, ens, 'eth', 7, (err, result) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          // TODO: Check that the registrar is correctly instanciated
          console.log('done initialiting', err, result)
          return resolve();
        });
        */
        contract = window.web3.eth.contract(abi).at(customEnsAddress || ensAddress);
        window.registrarContract = contract;
        //registrar = new Registrar(window.web3, ens, 'eth', 7);
        return resolve(); // TODO: This is a hack as the registrar callback isnt working
      } catch (e) {
        return reject(`Error initialiting ENS registrar: ${e}`);
      }
    });
  }

  function getName(name) {
    let entry;
    console.log('Fetching name', name);
    return new Promise((resolve, reject) => {
      const hash = window.web3.sha3(name);
      contract.entries(hash, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        entry = {
          deedAddress: result[1],
        };
        window.web3.eth.contract(deedAbi).at(entry.deedAddress, (deedError, deedContract) => {
          deedContract.owner((ownerError, ownerResult) => {
            deedContract.previousOwner((previousOwnerError, previousOwnerResult) => {
              deedContract.value((valueError, valueResult) => {
                deedContract.creationDate((creationDateError, creationDateResult) => {
                  resolve({
                    ownedByENSTrade: (ownerResult === ENSTrade.getAddress()),
                    entry,
                    owner: ownerResult,
                    previousOwner: previousOwnerResult,
                    value: valueResult,
                    creationDate: creationDateResult.toNumber(),
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  function initEthereum() {
    if (initialized) return Promise.resolve();
    initialized = true;
    reportStatus('Connecting to Ethereum network...');
    return initWeb3()
      .then(checkConnection)
      .then(watchDisconnect) //eslint-disable-line
      .then(checkNetwork)
      .catch((err) => {
        if (err !== errors.invalidNetwork || !customEnsAddress) {
          throw err;
        }
      })
      .then(initRegistrar)
      .then(ENSTrade.init())
      .then(() => {
        console.log('Network:', network);
        // set a global for easier debugging on the console
        window.g = { ens, registrar, network };
        console.log('ready');
        return reportStatus('Ready!', true);
      })
      .catch((err) => {
        console.error(err);
        reportStatus(err, false, true);
      });
  }

  function watchDisconnect() {
    function check() {
      if (window.web3.isConnected()) {
        setTimeout(check, 2500);
      } else {
        initEthereum();
      }
    }

    return new Promise((resolve, reject) => {
      check();
      resolve();
    });
  }

  return {
    init: initEthereum,
    initialized,
    getDeed,
    getEntry,
    transfer,
    transferToENSTrade,
    getName,
    getENSAddress,
    onStatusChange(callback) {
      subscribers.push(callback);
    },
    setCustomContract(newAddress) {
      customEnsAddress = newAddress;
    },
  };
};

const eth = ethereum();
export default eth;
