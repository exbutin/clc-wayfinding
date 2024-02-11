import { combineReducers } from "redux";
import mapButtons from "./MapButtonsReducer";
import userLocation from "./UserLocationReducer";
import symbols from "./SymbolsReducer";
import database from "./DatabaseReducer";

export default combineReducers({
  mapButtons,
  userLocation,
  symbols,
  database,
});
