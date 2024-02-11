import {
  SET_ACTIVE_LEVEL,
  SET_PAST_ACTIVE_LEVELS,
  REMOVE_LAST_ACTIVE_LEVEL,
  SET_ACTIVE_FILTER,
  SET_PAST_ACTIVE_FILTERS,
  REMOVE_LAST_ACTIVE_FILTER,
  TOGGLE_SHOW_ALL_PINS,
} from "../Actions";

const initialState = {
  pins: [],
  levels: [],
  activeLevel: {},
  pastActiveLevels: [],
  activeFilter: null,
  pastActiveFilters: [],
  showAllPins: false,
};

function mapButtons(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_LEVEL:
      return {
        ...state,
        activeLevel: action.payload,
      };
    case SET_PAST_ACTIVE_LEVELS:
      return {
        ...state,
        pastActiveLevels: action.payload,
      };
    case REMOVE_LAST_ACTIVE_LEVEL:
      return {
        ...state,
        pastActiveLevels: state.pastActiveLevels.slice(0, -1),
      };
    case SET_ACTIVE_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
      };
    case SET_PAST_ACTIVE_FILTERS:
      return {
        ...state,
        pastActiveFilters: action.payload,
      };
    case REMOVE_LAST_ACTIVE_FILTER:
      return {
        ...state,
        pastActiveFilters: state.pastActiveFilters.slice(0, -1),
      };
    case TOGGLE_SHOW_ALL_PINS:
      return {
        ...state,
        showAllPins: !state.showAllPins,
      };
    default:
      return state;
  }
}

export default mapButtons;
