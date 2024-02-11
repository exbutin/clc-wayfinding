import { UPDATE_USER_LOCATION } from '../Actions';

const initialState = {
    userLocation: null,
};

const userLocation = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_LOCATION:
            return {
                ...state,
                userLocation: action.payload,
            };
        default:
            return state;
    }
};

export default userLocation;