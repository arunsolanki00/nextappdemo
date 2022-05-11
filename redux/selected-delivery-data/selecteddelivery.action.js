import { useDispatch, useSelector } from "react-redux";
import { SelectedDeliveryTypes } from "./selecteddelivery.types";

export const savechoosetime = (item) => {
    return async dispatch => {
        dispatch({
            type: SelectedDeliveryTypes.SAVE_CHOOSE_TIME,
            payload: item
        })
    }
}

export const setpickupordelivery = (item) => {
    return async dispatch => {
        dispatch({
            type: SelectedDeliveryTypes.SET_PICKUP_OR_DELIVERY,
            payload: item
        })
    }
}

export const selecteddeliveryaddress = (item) => {
    return async dispatch => {
        dispatch({
            type: SelectedDeliveryTypes.SELECTED_DELIVERY_ADDRESS,
            payload: item
        })
    }
}
export const cleardeliveryaddress = () => {
    return async dispatch => {
        dispatch({
            type: SelectedDeliveryTypes.CLEAR_DELIVERY_ADDRESS,
            payload: null
        })
    }
}