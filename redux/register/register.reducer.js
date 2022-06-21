import { RegisterTypes } from "./register.types";

const REGISTER_INITIAL_STATE = {
    register: []
};

const registerReducer = (state = REGISTER_INITIAL_STATE, action) => {
    switch (action.type) {
        case RegisterTypes.REGISTER_USER_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    registeruser: action.payload,
                };
            } else {
                return {
                    ...state
                }
            } 
            case RegisterTypes.RESET_REGISTER:
                    return {
                        register: []       
                    };
            
        default:
            return state;
    }
}

export default registerReducer;