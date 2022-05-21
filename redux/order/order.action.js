import { useDispatch, useSelector } from "react-redux";
import { OrderServices } from "./order.services";
import { OrderTypes } from "./order.types";


export const checkOrderTime = (restaurantId,locationId,recievingTime,recieving,flg) => {        
    return async dispatch => {        
        OrderServices.checkOrderTime(restaurantId,locationId,recievingTime,recieving,flg).then(response => {            
            if (response) {                
                dispatch({
                    type: OrderTypes.CHECK_ORDER_TIME,
                    payload: response                    
                })                
            }             
        })
    }
}
export const getordertime = (locationId, restaurantId,ordertype) => {        
    return async dispatch => {        
        OrderServices.getOrderTime(locationId, restaurantId,ordertype).then(response => {            
            if (response) {                
                dispatch({
                    type: OrderTypes.CHECK_ORDER_TIME,
                    payload: response                    
                })                
            }             
        })
    }
}
export const setordertime = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.CHECK_ORDER_TIME,
            payload: item
        })
    }
}
export const isasap = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.IS_ASAP_TYPE,
            payload: item
        })
    }
}
export const emptyorder = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.EMPTY_ORDER,
            payload: null
        })
    }
}
export const setorderId = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.SET_ORDER_ID,
            payload: item
        })
    }
}
export const isRedirectToCheckout = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.IS_REDIRECT_TO_CHECKOUT,
            payload: item
        })
    }
}
export const emptyordertime = () => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.EMPTY_ORDER_TIME,
            payload: null
        })
    }
}
export const addCalculatedTotal = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.ADD_CALCULATED_ORDER_TOTAL,
            payload: item
        })
    }
}
export const addCardShowMessage = (item) => {
    return async dispatch => {
        dispatch({
            type: OrderTypes.CARD_SHOW_MESSAGE,
            payload: item
        })
    }
}