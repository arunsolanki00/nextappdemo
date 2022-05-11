import {
    RestaurantsTypes
} from "./restaurants.types";

const RESTAURANTS_INITIAL_STATE = {
    restaurantsList: [],
    restaurantdetail: null,
    leftmenutoggle: false,
    restaurantslocationlist: [],
    restaurantstiminglist: []
};

const restaurantsReducer = (state = RESTAURANTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case RestaurantsTypes.GET_RESTAURANTS_DATA:
            if (action.payload) {
                return {
                    ...state,
                    restaurantsList: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
            case RestaurantsTypes.RESTAURANT_DETAIL:
                if (action.payload) {
                    return {
                        ...state,
                        restaurantdetail: action.payload,
                    };
                }
                case RestaurantsTypes.UPDATE_RESTAURANT_DETAIL:
                    if (action.payload) {
                        return {
                            ...state,
                            restaurantdetail: action.payload,
                        };
                    }
                    case RestaurantsTypes.LEFT_MENU_TOGGLE:
                        return {
                            ...state,
                            leftmenutoggle: action.payload,
                        };
                    case RestaurantsTypes.RESTAURANT_LOCATION_LIST:
                        return {
                            ...state,
                            restaurantslocationlist: action.payload,
                        };
                    case RestaurantsTypes.RESTAURANT_TIMING:
                        return {
                            ...state,
                            restaurantstiminglist: action.payload,
                        };
                    default:
                        return state;
    }
}

export default restaurantsReducer;