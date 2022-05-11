import { LoginTypes } from "./login.types";

const LOGIN_INITIAL_STATE = {
    loggedinuser: null
};

const loginReducer = (state = LOGIN_INITIAL_STATE, action) => {
    
    switch (action.type) {
        case LoginTypes.USER_DETAIL:
            if (action.payload) {
                return {
                    ...state,
                    loggedinuser: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case LoginTypes.GET_LOGIN_USER_DETAIL:
            if (action.payload) {
                return {
                    ...state,
                    loggedinuser: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case LoginTypes.LOGOUT_USER:
            return {
                ...state,
                loggedinuser: action.payload,
            };

        default:
            return state;
    }
}

export default loginReducer;