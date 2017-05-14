const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INIT_ETHEREUM_PENDING': {
      return {
        ...initialState,
        fetching: true,
      };
    }
    case 'INIT_ETHEREUM_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
      };
    }
    case 'INIT_ETHEREUM_REJECTED': {
      return {
        ...initialState,
        fetchingError: action.payload,
      };
    }
    default:
      return state;
  }
}
