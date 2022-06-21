import { useDispatch, useSelector } from "react-redux";
import { FavouritesServices } from "./favourites.services";
import { FavouritesTypes } from "./favourites.types";

export const GetFavouritesList = (restaurantId, customerId,locationId) => {        
    return async dispatch => {        
        FavouritesServices.getFavouritesList(restaurantId, customerId,locationId).then(response => {            
            if (response) {                
                dispatch({
                    type: FavouritesTypes.FAVOURITES_LIST,
                    payload: response                    
                })                
            }             
        })
    }
}

export const resetFavourites = () => {
    return async dispatch => {
        dispatch({
            type: FavouritesTypes.RESET_FAVOURITES,
            payload: null
        })
    }
}