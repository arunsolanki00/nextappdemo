import { RestaurantTimmingTypes } from "./restaurant-hour.types";

const TIMMING_INITIAL_STATE = {
    timming: []
};

const timmingReducer = (state = TIMMING_INITIAL_STATE, action) => {
    switch (action.type) {    
        case RestaurantTimmingTypes.GET_TODAY_TIME:            
            if (action.payload) {
                return {
                    ...state,
                    timming: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }    
        case RestaurantTimmingTypes.ADD_TODAY_TIME:            
            if (action.payload) {
                return {
                    ...state,
                    timming: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }      
        default:
            return state;
        }
}

export default timmingReducer;