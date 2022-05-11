import { DemoActionTypes } from './demo.types';

const INITIAL_STATE = {
    demo_count:0,
    demo_cart:[]
}

const demoReducer = (statecart = INITIAL_STATE, action) =>{ 
    switch (action.type) {
        
        case DemoActionTypes.GET_ITEMS:
            return {
                ...statecart,
                demo_cart: action.payload
            };
        case DemoActionTypes.ADD_ITEMS:
            return {
                
                ...statecart,
                demo_count: statecart.demo_count + action.payload
            }
        default:
            return statecart;
    }
}

export default demoReducer;