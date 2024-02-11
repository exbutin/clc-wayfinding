import {
  SET_DATABASE,
  UPDATE_DATABASE,
  DELETE_DATABASE,
  UPDATE_DATABASE_BULK,
} from "../Actions";

const initialState = {
  pins: [],
  levels: [],
  menus: [],
};

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATABASE:
      return {
        ...state,
        pins: action.payload.pins,
        levels: action.payload.levels,
        menus: action.payload.menus,
      };
    case UPDATE_DATABASE:
      return {
        ...state,
        [action.payload.dataType]: state[action.payload.dataType].map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        ),
      };
    case DELETE_DATABASE:
      return {
        ...state,
        [action.payload.dataType]: state[action.payload.dataType].filter(
          (item) => item._id !== action.payload.id
        ),
      };
    case UPDATE_DATABASE_BULK:
      return {
        ...state,
        [action.payload.dataType]: action.payload.data,
      };
    default:
      return state;
  }
};

export default databaseReducer;
