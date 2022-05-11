import {AddressTypes} from './address.types'

const INITIAL_STATE = {
    address: {
        address1:"",
        address2:"",
        address3:"",
        city:"",
        state:"",
        country:"",
        zipcode:"",
        addressType:0
      }
  };
  
const addressReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case AddressTypes.ADD_ADDRESS:
        return {
          ...state,
          address: action.payload,
        };
      case AddressTypes.GET_ADDRESS:
        return {
            ...state,
            getaddress: action.payload,
          };
      default:
        return state; // this is not initial state otherwise it's load default state
    }
  };
  
  export default addressReducer;
  