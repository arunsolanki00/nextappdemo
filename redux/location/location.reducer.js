import {
    LocationTypes
} from "./location.types";

const LOCATION_INITIAL_STATE = {
    location: []
};

const loginReducer = (state = LOCATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case LocationTypes.GET_ALL_LOCATIONS:
            if (action.payload) {
                return {
                    ...state,
                    location: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
            case LocationTypes.GET_LOCATION_BY_ID:
                if (action.payload) {
                    return {
                        ...state,
                        location: action.payload,
                    };
                } else {
                    return {
                        ...state
                    }
                }

                case LocationTypes.RESET_LOCATION:
                    return {
                        location: []
                    };

                default:
                    return state;
    }
}

export default loginReducer;