import {
    OrderTypes
} from "./order.types";

const ORDER_INITIAL_STATE = {
    checktime: '',
    isasap: false,
    orderId: 0,
    isRedirectToCheckout: false,
    calculatedTotal: 0,
    cardShowMessage:''
};

const orderReducer = (state = ORDER_INITIAL_STATE, action) => {
    switch (action.type) {
        case OrderTypes.CHECK_ORDER_TIME:
            if (action.payload) {
                return {
                    ...state,
                    checktime: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case OrderTypes.GET_ORDER_TIME:
            if (action.payload) {
                return {
                    ...state,
                    ordertime: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case OrderTypes.IS_ASAP_TYPE:
            if (action.payload === true || action.payload === false) {
                return {
                    ...state,
                    isasap: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case OrderTypes.EMPTY_ORDER:
            if (action.payload) {
                return {
                    checktime: '',
                    isasap: false,
                    orderId: 0,
                    calculatedTotal:0
                };
            } else {
                return {
                    ...state
                }
            }
        case OrderTypes.SET_ORDER_ID:
            return {
                ...state,
                orderId: action.payload,
            };

        case OrderTypes.IS_REDIRECT_TO_CHECKOUT:
            if (action.payload === true || action.payload === false) {
                return {
                    ...state,
                    isRedirectToCheckout: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case OrderTypes.EMPTY_ORDER_TIME:
            return {
                ...state,
                checktime: ''
            };
        case OrderTypes.ADD_CALCULATED_ORDER_TOTAL:
            return {
                ...state,
                calculatedTotal: action.payload
            };
            case OrderTypes.CARD_SHOW_MESSAGE:
                return {
                    ...state,
                    cardShowMessage: action.payload
                };
                
        default:
            return state;
    }
}
export default orderReducer;