import { useDispatch, useSelector } from "react-redux";
import { getCategoryItemList, removeCategoryList, selectedCategory } from "../category/category.action";
import { restaurantsdetail } from "../restaurants/restaurants.action";
import { MainServices } from "./main.services";
import { MainTypes } from "./main.types";

export const getMenuCategoryList = (restaurantId,locationId) => {        
    return async dispatch => {        
        MainServices.getMenuCategoryList(restaurantId,locationId).then(response => {            
            if (response) {                
                dispatch({
                    type: MainTypes.GET_MENU_CATEGORY_DATA,
                    payload: response                    
                })                
            }             
        })
    }
}

export const getSelectedRestaurantTime = (restaurantId,locationId) => {        
    return async dispatch => {        
        MainServices.getSelectedRestaurantWindowTime(restaurantId,locationId).then(response => {            
            if (response) {                
                dispatch({
                    type: MainTypes.GET_SELECTED_RESTAURANTTIME,
                    payload: response                    
                })                
            }             
        })
    }
}

export const refreshCategoryList = (newselectedRestaurant,customerId) =>{
    return async dispatch =>{
        MainServices.getMenuCategoryList(newselectedRestaurant.restaurantId, newselectedRestaurant.defaultlocationId).then(catresponse => {
            
            if (catresponse && catresponse !== null && catresponse !== undefined && catresponse.length > 0) {
               let categoryresponse = catresponse;
                dispatch({
                    type: MainTypes.GET_MENU_CATEGORY_DATA,
                    payload: categoryresponse
                })
                
                const firstCategory = catresponse[0]; // take first category
                firstCategory.catSelected = true;
                dispatch(selectedCategory(firstCategory));
                dispatch(getCategoryItemList(newselectedRestaurant.restaurantId, firstCategory.catId, customerId, newselectedRestaurant.defaultlocationId));

                let promotioncategories = catresponse.find(x => x.catName === 'PROMOTION');
                let promotionCatId = 0;
                if (promotioncategories) {
                    promotionCatId = promotioncategories.catId;

                    MainServices.getPromotionCategoryList(newselectedRestaurant.restaurantId, promotionCatId, customerId,
                        newselectedRestaurant.defaultlocationId).then(promocatresponse => {
                            if (promocatresponse && promocatresponse != null) {
                                dispatch({
                                    type: MainTypes.GET_PROMOTION_CATEGORY_DATA,
                                    payload: promocatresponse
                                })
                            }
                        });
                }
            }else{
                dispatch({
                    type: MainTypes.UPDATE_MENU_CATEGORY_DATA,
                    payload: []
                })
                dispatch({
                    type: MainTypes.UPDATE_PROMOTION_CATEGORY_DATA,
                    payload: []
                })
            }
        })

    }
}

