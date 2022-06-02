import { useDispatch, useSelector } from "react-redux";
// import { getSessionKey } from "../../components/Common/auth";
import { CartServices } from "./cart.services";
import { CartTypes } from "./cart.types";

export const getCartItem = (cartsessionId, locationId, restaurantId, cartId, customerId, rewardpoints, redeemamount, deliveryaddressId,tipPercentage,tipAmount) => {
    
    return async dispatch => {
        let tippercent= tipPercentage > 0 ? tipPercentage : 0; 
        let tip = tipAmount ? tipAmount: 0;
        CartServices.getCartItemList(cartsessionId, locationId, restaurantId, cartId, customerId, rewardpoints, redeemamount, deliveryaddressId,tippercent , tip).then(response => {
             
            if (response) {
                console.log("response.cartDetails.cartTotal :")
                  
                if(response?.cartDetails && response?.cartDetails?.cartTotal){
                    dispatch({
                        type: CartTypes.CART_DATA,
                        payload: response
                    })
                    dispatch({
                        type: CartTypes.CART_TOTAL,
                        payload: response.cartDetails.cartTotal
                    })
                }
            }
        })
    }
}

export const getCartItemCount = (cartsessionId, locationId, restaurantId, customerId) => {
    return async dispatch => {
        CartServices.getCartItemCount(cartsessionId, locationId, restaurantId, customerId).then(response => {
            ;
            if (response) {
                dispatch({
                    type: CartTypes.CART_ITEM_COUNT,
                    payload: response.cartCount
                })
            }
        })
    }
}

export const deleteCartItem = (cartsessionId, cartId, restaurantId, locationId) => {
    return async dispatch => {
        CartServices.deleteCartItem(cartsessionId, cartId, restaurantId, locationId).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.DELETE_CART_ITEM,
                    payload: response
                })
            }
        })
    }
}

export const updateCartItemCount = () => {
    return dispatch => {
        dispatch({
            type: CartTypes.UPDATE_CART_ITEM_COUNT,
            payload: 0
        })
    }
}

export const updateCartItem = () => {
    return dispatch => {
        dispatch({
            type: CartTypes.UPDATE_CART_DATA,
            payload: {}
        })
    }
}

export const setCartItem = (item) => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_CART_DATA,
            payload: item
        })
    }
}

export const checkCustomerRewardPoints = (restaurantId, customerId, rewardpoints, amount) => {
    return async dispatch => {
        CartServices.checkCustomerRewardPoints(restaurantId, customerId, rewardpoints, amount).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.CHECK_CUSTOMER_REWARD_POINTS,
                    payload: response
                })
            }
        })
    }
}

export const updatequantity = (cartsessionId, cartId, qty, price, locationId, restaurantId) => {
    return async dispatch => {
        CartServices.updatequantity(cartsessionId, cartId, qty, price, locationId, restaurantId).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.UPDATE_QUANTITY,
                    payload: response
                })
            }
        })
    }
}

export const carttotaldata = (cartsessionId, locationId, restaurantId, customerId, cartId, rewardpoints, redeemamount, tipPercentage, tipAmount, deliveryaddressId) => {
    
    return async dispatch => {
        CartServices.carttotal(cartsessionId, locationId, restaurantId, customerId, cartId, rewardpoints, redeemamount, tipPercentage, tipAmount, deliveryaddressId).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.CART_TOTAL,
                    payload: response.cartDetails
                })
            }
        })
    }
}

export const updatecarttotaldata = () => {
    return dispatch => {
        dispatch({
            type: CartTypes.CART_TOTAL,
            payload: {}
        })
    }
}

export const deliverycharges = (restaurantId, locationId,isGeoFancing) => {
    return async dispatch => {
        CartServices.deliverycharges(restaurantId, locationId, isGeoFancing).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.DELIVERY_CHARGES,
                    payload: response
                })
            }
        })
    }
}

export const setrewardpoint = (rewardpoints) => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_REWARD_POINT,
            payload: rewardpoints
        })
    }
}

export const clearrewardpoint = () => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_REWARD_POINT,
            payload: null
        })
    }
}

export const setcartgrandtotal = (item) => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_GRAND_TOTAL,
            payload: item
        })
    }
}

export const cartcheckout = (obj, restaurantId) => {
    return async dispatch => {
        CartServices.cartcheckout(obj, restaurantId).then(response => {
            if (response) {
                dispatch({
                    type: CartTypes.CART_CHECKOUT,
                    payload: response
                })
            }
        })
    }
}

export const carttransactionid = (id) => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_TRANSACTION_ID,
            payload: id
        })
    }
}

// export const stripepaymentintentid = (restaurantId, locationId, orderId, customerId, totalAmount) => {
//     return async dispatch => {
//         CartServices.getstripepaymentintentid(restaurantId, locationId, orderId, customerId, totalAmount).then(response => {
//             if (response) {
//                 dispatch({
//                     type: CartTypes.GET_PAYMENT_INTENT_ID,
//                     payload: response
//                 })
//             }
//         })
//     }
// }
export const orderinstruction = (message) => {
    return dispatch => {
        dispatch({
            type: CartTypes.SET_ORDER_INSTRUCTION,
            payload: message
        })
    }
}
export const emptycart = () => {
    return dispatch => {
        dispatch({
            type: CartTypes.CART_EMPTY,
            payload: null
        })
    }
}
export const stripepaymentintentid = (response) => {
    return dispatch => {
        dispatch({
            type: CartTypes.GET_PAYMENT_INTENT_ID,
            payload: response
        })
    }
}
export const clearCartItems = (restaurantinfo,rewardpoints,customerId,deliveryaddressId) => {
    // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, customerId,restaurantinfo.defaultlocationId);
    CartServices.deleteCartItemFromSessionId(cartsessionid, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId).then(response => {
        if (response) {
            dispatch({ type: CartTypes.DELETE_CART_ITEM, payload: response });
            dispatch(updateCartItem());
            dispatch(updateCartItemCount());

            let redeemPoint = rewardpoints.redeemPoint > 0 ? parseInt(rewardpoints.redeemPoint)  : 0;
            let redeemAmount = 0;
            if(redeemPoint > 0) {
                redeemAmount = rewardpoints.redeemPoint/rewardpoints.rewardvalue;
            }
            
            dispatch(getCartItem(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, customerId, redeemPoint, redeemAmount,
                deliveryaddressId > 0 ? deliveryaddressId : 0));
            dispatch(getCartItemCount(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, customerId));
        }
    })
}
export const deleteCartItemFromSessionId = (cartsessionId, restaurantId, locationId) => {
    // return (dispatch) => { 
        if(cartsessionId){
          let response = CartServices.deleteCartItemFromSessionId(cartsessionId, restaurantId, locationId);
    }
}

export const initialrewardpoint = (userinfo) => {
    return dispatch => {

        let rewardpoints = {
            rewardvalue: userinfo.rewardvalue,
            rewardamount: userinfo.rewardvalue > 0 ? userinfo.totalRewardPoints / userinfo.rewardvalue : 0,
            rewardPoint: userinfo.totalRewardPoints,
            totalRewardPoints: userinfo.totalRewardPoints,
            redeemPoint: 0,
          };
          dispatch({
            type: CartTypes.SET_REWARD_POINT,
            payload: rewardpoints,
          });

    }
}

// export const getOrderDetails = (cartsessionId, locationId, restaurantId, cartId, customerId, rewardpoints, redeemamount, deliveryaddressId,tipPercentage,tipAmount) => {
//     return async dispatch => {
//         let tippercent= tipPercentage > 0 ? tipPercentage : 0; 
//         let tip = tipAmount ? tipAmount: 0;
//         CartServices.getCartItemList(cartsessionId, locationId, restaurantId, cartId, customerId, rewardpoints, redeemamount, deliveryaddressId,tippercent , tip).then(response => {
//             if (response) {
                
//                 if(response?.cartDetails && response.cartDetails.cartTotal){
//                     dispatch({
//                         type: CartTypes.CART_DATA,
//                         payload: response
//                     })
//                     dispatch({
//                         type: CartTypes.CART_TOTAL,
//                         payload: response.cartDetails.cartTotal
//                     })
//                 }
//             }
//         })
//     }
// }