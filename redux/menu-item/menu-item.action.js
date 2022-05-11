import { useDispatch, useSelector } from "react-redux";
import { MenuItemServices } from "./menu-item.services";
import { MenuItemTypes } from "./menu-item.types";

export const getMenuItemList = (restaurantId,locationId,customerId,menuitemId,cartsessionId,cartId) => {        
    return async dispatch => {        
        MenuItemServices.getMenuItemList(restaurantId,locationId,customerId,menuitemId,cartsessionId,cartId).then(response => {            
            if (response) {                
                dispatch({
                    type: MenuItemTypes.MENU_ITEM_DETAIL_LIST,
                    payload: response                    
                })                
            }             
        })
    }
}

export const selectedMenuItem = (item) => {     
    return (dispatch) => {                                                     
        dispatch({
            type: MenuItemTypes.SELECTED_MENU_ITEM_DATA,
            payload: item                    
        })                
    }                            
}

export const removeMenuItemForFavorite = () => {     
    return (dispatch) => {                                                     
        dispatch({
            type: MenuItemTypes.REMOVE_MENU_ITEM_FAVORITE,
            payload: {}                    
        })                
    }                            
}

export const selectedItemSize = (item) => {     
    return (dispatch) => {                                                     
        dispatch({
            type: MenuItemTypes.SELECTED_ITEM_SIZE,
            payload: item                    
        })                
    }                            
}

export const removeMenuItem = () => {     
    return (dispatch) => {                                                     
        dispatch({
            type: MenuItemTypes.REMOVE_SELECTED_ITEM,
            payload: {}                    
        })                
    }                            
}

export const addFavorite = (customerId,restaurantId,menuItemId) => {     
    return async dispatch => {        
        MenuItemServices.addfavorite(customerId,restaurantId,menuItemId).then(response => {            
            if (response) {                
                dispatch({
                    type: MenuItemTypes.ADD_FAVORITE,
                    payload: response                    
                })                
            }             
        })
    }                          
}

export const deleteFavorite = (customerId,restaurantId,menuItemId) => {     
    return async dispatch => {        
        MenuItemServices.deletefavorite(customerId,restaurantId,menuItemId).then(response => {            
            if (response) {                
                dispatch({
                    type: MenuItemTypes.DELETE_FAVORITE,
                    payload: response                    
                })                
            }             
        })
    }                          
}

export const addItemToCart = (orderobj,restaurantId) => {     
    return async dispatch => {        
        MenuItemServices.addItemToCart(orderobj,restaurantId).then(response => {            
            if (response) {                
                dispatch({
                    type: MenuItemTypes.ADD_ITEM_TO_CART,
                    payload: response                    
                })                
            }             
        })
    }                          
}

export const selecteditemquantity = (quantity) => {     
    return (dispatch) => {                                                     
        dispatch({
            type: MenuItemTypes.SELECTED_ITEM_QUANTITY,
            payload: quantity                    
        })                
    }                            
}