import { useDispatch, useSelector } from "react-redux";
import { CategoryServices } from "./category.services";
import { CategoryTypes } from "./category.types";

export const getCategoryItemList = (restaurantId,categories,customerId,locationId) => {  
    return async dispatch => {        
        CategoryServices.getCategoryItemList(restaurantId,categories,customerId,locationId).then(response => {          
              
            if (response) {  
                dispatch({
                    type: CategoryTypes.CATEGORY_ITEM_LIST,
                    payload: response                    
                })                
            }             
        })
    }
}

export const selectedCategory = (item) => {   
    return async (dispatch) => {                                                     
        dispatch({
            type: CategoryTypes.SELECTED_CATEGORY_DATA,
            payload: item                    
        })                
    }                            
}

export const removeCategoryList = () => {     
    return async (dispatch) => {                                                     
        dispatch({
            type: CategoryTypes.REMOVE_CATEGORY_LIST,
            payload: []                    
        })                
    }                            
}

export const setCategoryList = (item) => {     
    return (dispatch) => {                                                     
        dispatch({
            type: CategoryTypes.SET_CATEGORY_LIST,
            payload: item                    
        })                
    }                            
}
export const resetCategory = () => {     
    return (dispatch) => {                                                     
        dispatch({
            type: CategoryTypes.RESET_CATEGORY,
            payload: null                   
        })                
    }                            
}

