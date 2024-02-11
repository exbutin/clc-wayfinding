import { SET_SYMBOLS, SET_ACTIVE_SYMBOL, CLEAR_ACTIVE_SYMBOL } from "../Actions";

const initialState = {
  symbols: [],
  activeSymbol: null,
};

export function symbols(state = initialState, action) {
  switch (action.type) {
    case SET_SYMBOLS:
      return {
        ...state,
        symbols: action.payload,
      };
    case SET_ACTIVE_SYMBOL:
      return {
        ...state,
        activeSymbol: action.payload,
      };
    case CLEAR_ACTIVE_SYMBOL:
      return {
        ...state,
        activeSymbol: null,
      };
    default:
      return state;
  }
}

export default symbols;