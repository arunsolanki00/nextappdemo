import { useDispatch, useSelector } from "react-redux";
import { RestaurantHoursServices } from "./restaurant-hour.services";
import { RestaurantTimmingTypes } from "./restaurant-hour.types";

export const getTodayTimming = (restaurantId,locationId) => {        
    return async dispatch => {        
        RestaurantHoursServices.getRestaurantTodayTimming(restaurantId,locationId).then(response => {            
            if (response) {                
                dispatch({
                    type: RestaurantTimmingTypes.ADD_TODAY_TIME,
                    payload: response                    
                })                
            }             
        })
    }
}