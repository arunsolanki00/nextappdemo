import { useDispatch, useSelector } from "react-redux";
import { AddressTypes } from "./address.types";

export const addAddress = (address) => {     
    return (dispatch) => {                                                     
        dispatch({
            type: AddressTypes.ADD_ADDRESS,
            payload: address                    
        });                
    }                            
}

export const resetAddress = () => {
    return dispatch => {
        dispatch({
            type: AddressTypes.RESET_ADDRESS,
            payload: null
        })
    }
}