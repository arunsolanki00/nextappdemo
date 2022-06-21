import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    DeliveryAddressServices
} from "./delivery-address.services";
import {
    DeliveryAddressTypes
} from "./delivery-address.types";

export const getAddress = (customerId, restaurantId, locationId) => {
    return async dispatch => {
        DeliveryAddressServices.getDeliveryAddress(customerId, restaurantId, locationId).then(response => {
            if (response) {
                dispatch({
                    type: DeliveryAddressTypes.GET_ADDRESS,
                    payload: response.AddressLists
                })
            }
        })
    }
}

export const deleteAddress = (deliveryaddressId, restaurantId) => {
    return async dispatch => {
        DeliveryAddressServices.deleteDeliveryAddress(deliveryaddressId, restaurantId).then(response => {
            if (response) {
                dispatch({
                    type: DeliveryAddressTypes.DELETE_ADDRESS,
                    payload: response
                })
            }
        })
    }
}

export const addAddress = (obj, restaurantId, locationId) => {
    return async dispatch => {
        DeliveryAddressServices.addDeliveryAddress(obj, restaurantId, locationId).then(response => {
            if (response) {
                dispatch({
                    type: DeliveryAddressTypes.ADD_ADDRESS,
                    payload: response
                })
            }
        })
    }
}

export const updateAddressCheck = (check) => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.UPDATE_ADDRESS_CHECK,
            payload: check
        })
    }
}

export const registerAddress = (address) => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.REGISTER_ADDRESS,
            payload: address
        })
    }
}

export const InsertAddressId = (addressId) => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.ADDRESS_ID,
            payload: addressId
        })
    }
}

export const AddTempDeliveryAddress = (address) => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.ADD_TEMP_DELIVERY_ADDRESS,
            payload: address
        })
    }
}

export const DeleteTempDeliveryAddress = () => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.DELETE_TEMP_DELIVERY_ADDRESS,
            payload: null
        })
    }
}


export const resetDeliveryAddress = () => {
    return async dispatch => {
        dispatch({
            type: DeliveryAddressTypes.RESET_DELIVERY_ADDRESS,
            payload: null
        })
    }
}

