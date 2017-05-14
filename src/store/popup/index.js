const initialState = {
  fetching: false,
  fetchingError: null,
  fetched: false,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_POPUP_PENDING': {
      return {
        ...initialState,
        fetching: true,
      };
    }
    case 'SHOW_POPUP_FULFILLED': {
      return {
        ...initialState,
        fetched: true,
        data: action.payload,
      };
    }
    case 'SHOW_POPUP_REJECTED': {
      return {
        ...initialState,
        fetchingError: action.payload,
      };
    }
    case 'HIDE_POPUP_FULFILLED': {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
