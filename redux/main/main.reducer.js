import { MainTypes } from "./main.types";

const MAIN_INITIAL_STATE = {
    maincategoryList: [],
    promotioncategoryList: []
};

const mainReducer = (state = MAIN_INITIAL_STATE, action) => {
    switch (action.type) {    
        case MainTypes.GET_MENU_CATEGORY_DATA:            
            if (action.payload) {
                return {
                    ...state,
                    maincategoryList: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }    
        case MainTypes.GET_PROMOTION_CATEGORY_DATA:            
            if (action.payload) {
                return {
                    ...state,
                    promotioncategoryList: action.payload,
                };
            } else {
                return {
                    ...state
                }
            } 
        case MainTypes.GET_SELECTED_RESTAURANTTIME:            
            if (action.payload) {
                return {
                    ...state,
                    restaurantWindowTime: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
            case MainTypes.UPDATE_PROMOTION_CATEGORY_DATA:            
                return {
                    ...state,
                    promotioncategoryList: [],
                };
            case MainTypes.UPDATE_MENU_CATEGORY_DATA:            
                return {
                    ...state,
                    maincategoryList: [],
                };
        default:
            return state;
        }
}

export default mainReducer;