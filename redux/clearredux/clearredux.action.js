import {  resetCart } from "../cart/cart.action";
import { resetCategory } from "../category/category.action";
import { resetMain } from "../main/main.action";
import { resetMenuitem } from "../menu-item/menu-item.action";
import {  resetSessionId } from "../session/session.action";
import { resetStudent } from "../student/student.action";

export const clearRedux = () => {
    return dispatch => {
        dispatch(resetCart());
        dispatch(resetMain());
        dispatch(resetMenuitem());
        dispatch(resetSessionId());
        dispatch(resetStudent());
        dispatch(resetCategory());
        
    }
}