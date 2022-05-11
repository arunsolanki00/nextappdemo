import { useDispatch, useSelector } from "react-redux";
import { RegisterServices } from "./register.services";
import { RegisterTypes } from "./register.types";

export const getMenuItemList = (registerModel, address) => {        
    return async dispatch => {        
        RegisterServices.registerUser(registerModel, address).then(response => {            
            if (response) {                
                dispatch({
                    type: RegisterTypes.REGISTER_USER_SUCCESS,
                    payload: response                    
                })                
            }             
        })
    }
}