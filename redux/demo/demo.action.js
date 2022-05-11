import { DemoActionTypes } from './demo.types';

export const addItem = item => ({
    type: DemoActionTypes.ADD_ITEMS,
    payload: item
})

export const getItem = item => ({
    type: CartActionTypes.GET_CART_ITEM,
    payload: item
})