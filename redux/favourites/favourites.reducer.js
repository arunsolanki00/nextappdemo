import {
    FavouritesTypes
} from "./favourites.types";

const FAVOURITES_INITIAL_STATE = {
    favouritesitemlist: []
};

const favouriteReducer = (state = FAVOURITES_INITIAL_STATE, action) => {
    switch (action.type) {
        case FavouritesTypes.FAVOURITES_LIST:
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
            case FavouritesTypes.RESET_FAVOURITES:
                return {
                    favouritesitemlist: []
                };
            default:
                return state;
    }
}

export default favouriteReducer;