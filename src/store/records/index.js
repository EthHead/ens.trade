const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
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
    case 'UPDATE_RECORDS_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
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
