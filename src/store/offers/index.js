const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
  offers: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NAME_PENDING': {
      return {
        ...initialState,
      };
    }
    case 'FETCH_OFFERS_PENDING': {
      return {
        ...initialState,
        fetching: true,
      };
    }
    case 'FETCH_OFFERS_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
        offers: action.payload,
      };
    }
    case 'FETCH_OFFERS_REJECTED': {
      return {
        ...initialState,
        fetchingError: action.payload,
      };
    }
    default:
      return state;
  }
}
