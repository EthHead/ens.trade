import BigNumber from 'bignumber.js';

const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
  entry: {},
  record: {},
  owner: null,
  previousOwner: null,
  value: new BigNumber(0),
  creationDate: 0,
  ownedByENSTrade: null,
  message: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NAME_PENDING': {
      return {
        ...initialState,
        fetching: true,
      };
    }
    case 'FETCH_NAME_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
        entry: action.payload.entry,
        record: action.payload.record,
        ownedByENSTrade: action.payload.ownedByENSTrade,
        owner: action.payload.owner,
        previousOwner: action.payload.previousOwner,
        value: action.payload.value,
        creationDate: action.payload.creationDate,
      };
    }
    case 'FETCH_NAME_REJECTED': {
      return {
        ...initialState,
        fetchingError: action.payload,
      };
    }
    default:
      return state;
  }
}
