import { useDispatch, useSelector } from "react-redux";
import { LoginServices } from "./login.services";
import { LoginTypes } from "./login.types";

export const getLoginUserDetails = (username,password,restaurantId) => {        
    // return async dispatch => {        
    //     LoginServices.getLoginUserDetails(username,password,restaurantId).then(response => {            
    //         if (response) {                
    //             // dispatch({
    //             //     type: LoginTypes.LOGIN_USER_SUCCESS,
    //             //     payload: response                    
    //             // })                
    //             dispatch({
    //                 type: LoginTypes.USER_DETAIL,
    //                 payload: response                    
    //             })   
    //             return response;        
    //         }             
    //     })
    // }
}

export const logout = () => {     
    return async (dispatch) => {                                                     
        dispatch({
            type: LoginTypes.LOGOUT_USER,
            payload: null                    
        })                
    }                            
}