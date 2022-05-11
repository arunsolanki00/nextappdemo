import { useDispatch, useSelector } from "react-redux";
import { LocationServices } from "../location/location.services";
import { RestaurantHoursServices } from "../restaurant-hour/restaurant-hour.services";
import { RestaurantsServices } from "./restaurants.services";
import { RestaurantsTypes } from "./restaurants.types";

export const getRestaurantsList = () => {        
    return async dispatch => {        
        RestaurantsServices.getRestaurantsList().then(response => {            
            if (response) {                
                dispatch({
                    type: RestaurantsTypes.GET_RESTAURANTS_DATA,
                    payload: response                    
                })                
            }             
        })
    }
}

export const restaurantsdetail = (item) => {    
    return async dispatch => {        
            if (item) {                
                dispatch({
                    type: RestaurantsTypes.RESTAURANT_DETAIL,
                    payload: item
                })                
            }             
        }        
}

export const updaterestaurantsdetail = (restauranturl,defaultLocationId) => {    
    return async dispatch => {        
        RestaurantsServices.getRestaurantsList(restauranturl,defaultLocationId).then(response => { 
            
            let newselectedRestaurant =  response ? response[0] : null;

            if (newselectedRestaurant) {                
                dispatch({
                    type: RestaurantsTypes.UPDATE_RESTAURANT_DETAIL,
                    payload: newselectedRestaurant                    
                })                
            }             
        })
    } 
}

export const leftMenuToggle = (item) => {     
    return async (dispatch) => {                                                     
        dispatch({
            type: RestaurantsTypes.LEFT_MENU_TOGGLE,
            payload: item                    
        })                
    }                            
}

export const  restaurantsLocation = async(restaurantId, lat, long) => {                    
     const response =  await LocationServices.getLocationInfo(restaurantId, lat, long);
     return response; 
}

export const restaurantstiming = (locationId, restaurantId) => {        
    return async dispatch => {        
        RestaurantHoursServices.getRestaurantHourList(locationId, restaurantId).then(response => {            
            if (response) {                
                dispatch({
                    type: RestaurantsTypes.RESTAURANT_TIMING,
                    payload: response                    
                })                
            }             
        })
    }
}

