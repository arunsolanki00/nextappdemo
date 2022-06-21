import { useDispatch, useSelector } from "react-redux";
import { LocationServices } from "./location.services";
import { LocationTypes } from "./location.types";

export const getLocations = (restaurantId,latitude,longitude) => {        
    return async dispatch => {        
        LocationServices.getLocationInfo(restaurantId,latitude,longitude).then(response => {            
            if (response) {                
                dispatch({
                    type: LocationTypes.GET_ALL_LOCATIONS,
                    payload: response                    
                })                
            }             
        })
    }
}

export const resetLocations = () => {
    return async dispatch => {
        dispatch({
            type: LocationTypes.RESET_LOCATION,
            payload: null
        })
    }
}