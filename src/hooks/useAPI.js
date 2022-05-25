import { useReducer } from 'react';

const initialState = {
  isLoading: true,
  data: null,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        isLoading: false,
        data: action.payload,
        error: null
      };
    case 'FETCH_ERROR':
      return {
        isLoading: false,
        data: null,
        error: action.error
      };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, initialState);

export { state, dispatch };
