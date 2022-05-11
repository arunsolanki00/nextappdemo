import {
  CartTypes
} from "./cart.types";

const CARTITEM_INITIAL_STATE = {
  cartitemdetail: {},
  cartitemcount: 0,
  carttotal: {},
  deliverycharges: {},
  rewardpoints: {},
  transactionid: null,
  grandtotal: 0,
  paymentintentid: '',
  orderinfo:{}
};

const cartReducer = (state = CARTITEM_INITIAL_STATE, action) => {
  switch (action.type) {
    case CartTypes.CART_DATA:
      if (action.payload) {
        return {
          ...state,
          cartitemdetail: action.payload,
        };
      } else {
        return {
          ...state,
        };
      }
      case CartTypes.CART_ITEM_COUNT:
        if (action.payload) {
          return {
            ...state,
            cartitemcount: action.payload,
          };
        } else {
          return {
            ...state,
          };
        }
        case CartTypes.UPDATE_CART_ITEM_COUNT:
          return {
            ...state,
            cartitemcount: 0,
          };
        case CartTypes.UPDATE_CART_DATA:
          return {
            ...state,
            cartitemdetail: {},
          };
        case CartTypes.SET_CART_DATA:
          return {
            ...state,
            cartitemdetail: action.payload,
          };
        case CartTypes.CART_TOTAL:
          if (action.payload) {
            return {
              ...state,
              carttotal: action.payload,
            };
          } else {
            return {
              ...state,
            };
          }
          case CartTypes.EMPTY_CART_TOTAL:
              return {
                ...state,
                carttotal: action.payload,
              };
          case CartTypes.DELIVERY_CHARGES:
            if (action.payload) {
              return {
                ...state,
                deliverycharges: action.payload,
              };
            } else {
              return {
                ...state,
              };
            }
            case CartTypes.EMPTY_DELIVERY_CHARGES:
              return {
                ...state,
                 deliverycharges: null
                }

            case CartTypes.SET_REWARD_POINT:
              return {
                ...state,
                rewardpoints: action.payload,
              };
            case CartTypes.SET_TRANSACTION_ID:
              return {
                ...state,
                transactionid: action.payload,
              };
            case CartTypes.SET_GRAND_TOTAL:
              return {
                ...state,
                grandtotal: action.payload,
              };
            case CartTypes.GET_PAYMENT_INTENT_ID:
              return {
                ...state,
                paymentintentid: action.payload,
              };
              case CartTypes.EMPTY_PAYMENT_INTENT_ID:
                return {
                  ...state,
                  paymentintentid: "",
                };
            case CartTypes.SET_ORDER_INSTRUCTION:
              return {
                ...state,
                orderinstruction: action.payload,
              };
            case CartTypes.CLEAN_REWARD_POINT:
              return {
                ...state,
                rewardpoints: action.payload,
              };
            case CartTypes.CART_EMPTY:
              return {
                //  ...state,
                  cartitemdetail: {},
                  cartitemcount: 0,
                  carttotal: {},
                  deliverycharges: {},
                  //rewardpoints: {},
                  transactionid: null,
                  grandtotal: 0,
                  paymentintentid: '',
              };
              case CartTypes.DELETE_CART_ITEM_FROM_SESSIONID:
                return {
                  //  ...state,
                  cartitemdetail: {},
                    cartitemcount: 0,
                    carttotal: {},
                    deliverycharges: {},
                    rewardpoints: {},
                    transactionid: null,
                    grandtotal: 0,
                    paymentintentid: '',
                };
                case CartTypes.SET_ORDER_INFO:
                  if (action.payload) {
                    return {
                      ...state,
                      orderinfo: action.payload,
                    };
                  } else {
                    return {
                      ...state,
                    };
                  }
                case CartTypes.EMPTY_ORDER_INFO:
                      return {
                        ...state,
                        orderinfo: null,
                      };
            default:
              return state;
  }
};

export default cartReducer;