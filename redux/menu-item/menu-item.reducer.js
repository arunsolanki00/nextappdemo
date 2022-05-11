import { MenuItemTypes } from "./menu-item.types";

const MENUITEM_INITIAL_STATE = {
    selectedmenuitemdetail: {},
    menuitemdetaillist: {},
    selecteditemquantity: 0
};

const menuItemReducer = (state = MENUITEM_INITIAL_STATE, action) => {
    switch (action.type) {
        case MenuItemTypes.MENU_ITEM_DETAIL_LIST:
            if (action.payload) {
                return {
                    ...state,
                    menuitemdetaillist: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case MenuItemTypes.SELECTED_MENU_ITEM_DATA:
            if (action.payload) {
                return {
                    ...state,
                    selectedmenuitemdetail: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case MenuItemTypes.SELECTED_ITEM_SIZE:
            if (action.payload) {
                return {
                    ...state,
                    menuitemdetaillist: action.payload,
                };
            } else {
                return {
                    ...state
                }
            }
        case MenuItemTypes.REMOVE_SELECTED_ITEM:
            return {
                ...state,
                menuitemdetaillist: action.payload,
            };
        case MenuItemTypes.REMOVE_MENU_ITEM_FAVORITE:
            return {
                ...state,
                selectedmenuitemdetail: action.payload,
            };
        case MenuItemTypes.SELECTED_ITEM_QUANTITY:
            return {
                ...state,
                selecteditemquantity: action.payload,
            };
        default:
            return state;
    }
}

export default menuItemReducer;