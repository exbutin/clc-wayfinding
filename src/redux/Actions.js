import axios from "axios";

export const SET_ACTIVE_LEVEL = "SET_ACTIVE_LEVEL";
export const SET_PAST_ACTIVE_LEVELS = "SET_PAST_ACTIVE_LEVELS";
export const REMOVE_LAST_ACTIVE_LEVEL = "REMOVE_LAST_ACTIVE_LEVEL";
export const SET_ACTIVE_FILTER = "SET_ACTIVE_FILTER";
export const SET_PAST_ACTIVE_FILTERS = "SET_PAST_ACTIVE_FILTERS";
export const REMOVE_LAST_ACTIVE_FILTER = "REMOVE_LAST_ACTIVE_FILTER";
export const TOGGLE_SHOW_ALL_PINS = "TOGGLE_SHOW_ALL_PINS";

export const SET_SYMBOLS = "SET_SYMBOLS";
export const SET_ACTIVE_SYMBOL = "SET_ACTIVE_SYMBOL";
export const CLEAR_ACTIVE_SYMBOL = "CLEAR_ACTIVE_SYMBOL";

export const UPDATE_USER_LOCATION = "UPDATE_USER_LOCATION";

export const SET_ADD_PIN_FILTER = "SET_ADD_PIN_FILTER";

export const SET_DATABASE = "SET_DATABASE";
export const UPDATE_DATABASE = "UPDATE_DATABASE";
export const UPDATE_DATABASE_BULK = "UPDATE_DATABASE_BULK";
export const FETCH_DATABASE = "FETCH_DATABASE";
export const DELETE_DATABASE = "DELETE_DATABASE";

// Toggle show all pins between true and false
export const toggleShowAllPins = () => ({
  type: TOGGLE_SHOW_ALL_PINS,
});

// Update the setActiveLevel and setActiveFilterButton actions
export const setActiveLevel = (level) => {
  return (dispatch, getState) => {
    const { activeLevel, pastActiveLevels } = getState().mapButtons;

    dispatch({
      type: "SET_PAST_ACTIVE_LEVELS",
      payload: [
        ...pastActiveLevels,
        { level: activeLevel, timestamp: Date.now() },
      ],
    });
    dispatch({ type: "SET_ACTIVE_LEVEL", payload: level });
  };
};

export const setActiveFilter = (filter) => {
  return (dispatch, getState) => {
    const { activeFilter, pastActiveFilters } = getState().mapButtons;
    dispatch({
      type: "SET_PAST_ACTIVE_FILTERS",
      payload: [
        ...pastActiveFilters,
        { filter: activeFilter, timestamp: Date.now() },
      ],
    });
    dispatch({ type: "SET_ACTIVE_FILTER", payload: filter });
  };
};

// Create the setLastActive action
export const setLastActive = () => {
  return (dispatch, getState) => {
    const { pastActiveLevels } = getState().mapButtons;
    const { pastActiveFilters } = getState().mapButtons;
    const lastActiveLevel =
      pastActiveLevels.length > 0
        ? pastActiveLevels[pastActiveLevels.length - 1]
        : null;
    const lastActiveFilter =
      pastActiveFilters.length > 0
        ? pastActiveFilters[pastActiveFilters.length - 1]
        : null;

    if (
      lastActiveLevel &&
      lastActiveFilter &&
      lastActiveLevel.timestamp > lastActiveFilter.timestamp
    ) {
      dispatch({ type: "SET_ACTIVE_LEVEL", payload: lastActiveLevel.level });
      dispatch({ type: "REMOVE_LAST_ACTIVE_LEVEL" });
    } else if (lastActiveFilter) {
      dispatch({ type: "SET_ACTIVE_FILTER", payload: lastActiveFilter.filter });
      dispatch({ type: "REMOVE_LAST_ACTIVE_FILTER" });
    }
  };
};

export const updateUserLocation = (location, callback) => (dispatch) => {
  dispatch({
    type: "UPDATE_USER_LOCATION",
    payload: location,
  });

  if (callback) {
    callback();
  }
};

//symbols

export function setSymbols(symbols) {
  return { type: SET_SYMBOLS, payload: symbols };
}

export const setActiveSymbol = (symbol) => ({
  type: SET_ACTIVE_SYMBOL,
  payload: symbol,
});

export const clearActiveSymbol = () => ({
  type: CLEAR_ACTIVE_SYMBOL,
});

// full database

export const setDatabase = (data) => ({
  type: SET_DATABASE,
  payload: data,
});

export const fetchDatabase = () => {
  return (dispatch) => {
    axios
      .get("http://localhost:5000/api/database")
      .then((response) => {
        dispatch(setDatabase(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
};

export const updateDatabase = (selectedDataset, id, updatedRow) => {
  return (dispatch) => {
    // Ensure id is included in the URL
    const url = `http://localhost:5000/api/database/${selectedDataset}/${id}`;

    return axios
      .put(url, updatedRow)
      .then((response) => {
        const action = {
          type: UPDATE_DATABASE,
          payload: { dataType: selectedDataset, data: response.data },
        };
        dispatch(action);
        return response;
      })
      .catch((error) => {
        console.error("Error updating item: ", error);
        throw error;
      });
  };
};

export const addDatabaseRecord = (selectedDataset, newRow) => {
  return (dispatch) => {
    const url = `http://localhost:5000/api/database/${selectedDataset}`;

    return axios
      .post(url, newRow)
      .then((response) => {
        const action = {
          type: UPDATE_DATABASE, // You might want to create a new action type for adding records
          payload: { dataType: selectedDataset, data: response.data },
        };
        dispatch(action);
        return response;
      })
      .catch((error) => {
        console.error("Error adding item: ", error);
        throw error;
      });
  };
};

export const updateDatabaseBulk = (selectedDataset, documents) => {
  return (dispatch) => {
    const url = `http://localhost:5000/api/database/${selectedDataset}/bulk`;

    return axios
      .post(url, documents)
      .then((response) => {
        const action = {
          type: UPDATE_DATABASE_BULK,
          payload: { dataType: selectedDataset, data: response.data },
        };
        dispatch(action);
        alert("Bulk operation completed successfully");
        return response;
      })
      .catch((error) => {
        alert("An error occurred during the bulk operation", error);
        throw error;
      });
  };
};

export const deleteDatabase = (dataType, id) => {
  return (dispatch) => {
    const url = `http://localhost:5000/api/database/${dataType}/${id}`;

    return axios
      .delete(url)
      .then((response) => {
        dispatch({
          type: DELETE_DATABASE,
          payload: { dataType, id },
        });
        return response;
      })
      .catch((error) => {
        console.error("Error deleting item: ", error);
        // Dispatch another action here if you want to handle errors
        throw error;
      });
  };
};
