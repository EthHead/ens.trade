import Ethereum from '../components/Ethereum';
import * as ENSTrade from '../components/ENSTrade';

const zero = '0x0000000000000000000000000000000000000000';

export function init() {
  return {
    type: 'INIT_ETHEREUM',
    payload: Ethereum.init()
    .then((result) => {
      return result;
    }),
  };
}

export function updateRecords() {
  if (!Ethereum.isLocalWeb3()) {
    return {
      type: 'UPDATE_RECORDS',
      payload: ENSTrade.getRecordsFromFile()
      .then((records) => {
        // console.log(records);
        return records;
      }),
    };
  }
  return {
    type: 'UPDATE_RECORDS',
    payload: ENSTrade.updateRecordsFromEvents()
    .then((records) => {
      // console.log(records);
      return records;
    }),
  };
}

export function recordsCurrentListedUpdated(count) {
  return {
    type: 'RECORDS_CURRENTLY_LISTED_UPDATED',
    payload: Promise.resolve(count),
  };
}

export function recordsUpdated(records) {
  return {
    type: 'RECORDS_UPDATED',
    payload: Promise.resolve(records),
  };
}

export function getName(record) {
  let nameResult;
  return {
    type: 'FETCH_NAME',
    payload: Ethereum.getName(record)
    .then((result) => {
      nameResult = result;
      return nameResult;
    })
    .then(() => {
      if (nameResult.entry.deedAddress === zero) {
        return {
          record: {},
        };
      }
      return ENSTrade.getRecord(nameResult.entry.hash);
    })
    .then((rec) => {
      return {
        ...nameResult,
        record: rec,
      };
    }),
  };
}

export function getRecord(hash) {
  return {
    type: 'FETCH_RECORD',
    payload: ENSTrade.getRecord(hash)
    .then((result) => {
      return result;
    }),
  };
}

export function getOffers(hash) {
  return {
    type: 'FETCH_OFFERS',
    payload: ENSTrade.getOffersFromEvents(hash)
    .then((result) => {
      return result;
    }),
  };
}

export function transferToENSTrade(name) {
  return {
    type: 'TRANSFER_TO_ENSTRADE',
    payload: Ethereum.transferToENSTrade(name)
    .then((result) => {
      return result;
    }),
  };
}

export function newListing(name, buyPrice, message) {
  return {
    type: 'NEW_LISTING',
    payload: ENSTrade.newListing(name, buyPrice, message)
    .then((result) => {
      return result;
    }),
  };
}

export function newOffer(deedAddress, message, value) {
  return {
    type: 'NEW_OFFER',
    payload: ENSTrade.newOffer(deedAddress, message, value)
    .then((result) => {
      return result;
    }),
  };
}

export function acceptOffer(deedAddress, offerAddress, offerValue) {
  return {
    type: 'ACCEPT_OFFER',
    payload: ENSTrade.acceptOffer(deedAddress, offerAddress, offerValue)
    .then((result) => {
      return result;
    }),
  };
}

export function cancelOffer(deedAddress) {
  return {
    type: 'CANCEL_OFFER',
    payload: ENSTrade.cancelOffer(deedAddress)
    .then((result) => {
      return result;
    }),
  };
}

export function deList(deedAddress) {
  return {
    type: 'DELIST_LISTING',
    payload: ENSTrade.deList(deedAddress)
    .then((result) => {
      return result;
    }),
  };
}

export function reclaim(deedAddress) {
  return {
    type: 'RECLAIM_LISTING',
    payload: ENSTrade.reclaim(deedAddress)
    .then((result) => {
      return result;
    }),
  };
}

export function showPopup(data) {
  return {
    type: 'SHOW_POPUP',
    payload: Promise.resolve(data),
  };
}

export function hidePopup() {
  return {
    type: 'HIDE_POPUP',
    payload: Promise.resolve(),
  };
}

export default () => {};
