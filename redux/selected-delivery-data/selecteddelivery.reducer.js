import { SelectedDeliveryTypes } from "./selecteddelivery.types";

const INITIAL_STATE = {
    choosetime: {},
    pickupordelivery: {},
    selecteddeliveryaddress: {},
};

const selecteddeliveryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SelectedDeliveryTypes.SAVE_CHOOSE_TIME:
            return {
                ...state,
                choosetime: action.payload,
            };
        case SelectedDeliveryTypes.SET_PICKUP_OR_DELIVERY:
            return {
                ...state,
                pickupordelivery: action.payload,
            };
        case SelectedDeliveryTypes.SELECTED_DELIVERY_ADDRESS:
            return {
                ...state,
                selecteddeliveryaddress: action.payload,
            };
        case SelectedDeliveryTypes.CLEAR_DELIVERY_ADDRESS:
                return {
                    choosetime: {},
                    pickupordelivery: {},
                    selecteddeliveryaddress: {},
                };
        case SelectedDeliveryTypes.RESET_SELECTDELIVERY:
            return{
                choosetime: {},
                pickupordelivery: {},
                selecteddeliveryaddress: {}
            }
        default:
            return state;
    }
};

export default selecteddeliveryReducer;