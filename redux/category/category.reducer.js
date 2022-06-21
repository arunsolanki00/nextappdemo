import { CategoryTypes } from "./category.types";

const CATEGORY_INITIAL_STATE = {
    selectedcategorydetail: {},
    categoryitemlist: []
};

const categoryReducer = (state = CATEGORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case CategoryTypes.SELECTED_CATEGORY_DATA:
            if (action.payload) {
                return {
                    ...state,
                    selectedcategorydetail: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case CategoryTypes.CATEGORY_ITEM_LIST:
            if (action.payload) {
                return {
                    ...state,
                    categoryitemlist: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case CategoryTypes.REMOVE_CATEGORY_LIST:
            return {
                ...state,
                categoryitemlist: action.payload,
            };
        case CategoryTypes.SET_CATEGORY_LIST:
            return {
                ...state,
                categoryitemlist: action.payload,
            };
            case CategoryTypes.RESET_CATEGORY:
                return {
                    selectedcategorydetail: {},
                    categoryitemlist: []
                };
        default:
            return state;
    }
}

export default categoryReducer;