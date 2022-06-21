import { DeliveryAddressTypes } from "./delivery-address.types";

const INITIAL_STATE = {
  deliveryaddressdata: {},
  updatedAddress: false,
  choosetime: {},
  registeraddress: {},
  addressId:{},
  tempDeliveryAddress:[],
};

const deliveryaddressReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DeliveryAddressTypes.GET_ADDRESS:
      return {
        ...state,
        deliveryaddressdata: action.payload,
      };
    case DeliveryAddressTypes.UPDATE_ADDRESS_CHECK:
      return {
        ...state.updatedAddress,
        isAddressUpdated: action.payload,
      };
    case DeliveryAddressTypes.REGISTER_ADDRESS:
      return {
        ...state,
        registeraddress: action.payload,
      };
      case DeliveryAddressTypes.ADD_ADDRESS:
        return {
          ...state,
          addressId: action.payload,
        };
        case DeliveryAddressTypes.UPDATE_ADDRESS_ID:
          return {
            ...state,
            addressId: action.payload,
          };
          case DeliveryAddressTypes.ADD_TEMP_DELIVERY_ADDRESS:
            return {
              ...state,
              tempDeliveryAddress: action.payload,
            };
            case DeliveryAddressTypes.RESET_DELIVERY_ADDRESS:
              return {
                deliveryaddressdata: {},
                updatedAddress: false,
                choosetime: {},
                registeraddress: {},
                addressId:{},
                tempDeliveryAddress:[]
              };
            case DeliveryAddressTypes.DELETE_TEMP_DELIVERY_ADDRESS:
            return {
              ...state,
              tempDeliveryAddress: null,
            };
    default:
      return state;
  }
};

export default deliveryaddressReducer;