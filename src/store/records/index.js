const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
  totalRecords: 0,
  records: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_RECORDS_PENDING': {
      return {
        ...initialState,
        fetching: true,
      };
    }
    case 'RECORDS_UPDATED_FULFILLED': {
      return {
        ...initialState,
        fetching: true,
        totalRecords: action.payload.totalRecords,
        records: action.payload.records,
      };
    }
    case 'UPDATE_RECORDS_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
        totalRecords: action.payload.length,
        records: action.payload,
      };
    }
    case 'UPDATE_RECORDS_REJECTED': {
      return {
        ...initialState,
        fetchingError: action.payload,
      };
    }
    default:
      return state;
  }
}
