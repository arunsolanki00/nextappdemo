import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from './cart/cart.reducer';
import categoryReducer from './category/category.reducer';
import demoReducer from './demo/demo.reducer';
import mainReducer from './main/main.reducer';
import menuItemReducer from './menu-item/menu-item.reducer';
import restaurantsReducer from './restaurants/restaurants.reducer';
import favouriteReducer from './favourites/favourites.reducer';
import registerReducer from './register/register.reducer';
import loginReducer from './login/login.reducer';
// import locationReducer from './location/location.reducer';
import timmingReducer from './restaurant-hour/restaurant-hour.reducer';
import deliveryaddressReducer from './delivery-address/delivery-address.reducer';
import selecteddeliveryReducer from './selected-delivery-data/selecteddelivery.reducer';
import orderReducer from "./order/order.reducer";
import sessionReducer from './session/session.reducer';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userdetail', 'selecteddelivery','cart','order','selecteddelivery','menuitem','main','restaurantWindowTime','deliveryaddress','session']
}

const rootReducer = combineReducers({
    demo: demoReducer,
    restaurant: restaurantsReducer,
    main: mainReducer,
    category: categoryReducer,
    menuitem: menuItemReducer,
    cart: cartReducer,
    favourite: favouriteReducer,
    register: registerReducer,
    userdetail: loginReducer,
    //  location:locationReducer,
    todaytimming: timmingReducer,
    order:orderReducer,
    deliveryaddress: deliveryaddressReducer,
    selecteddelivery: selecteddeliveryReducer,
    session:sessionReducer
});

export default persistReducer(persistConfig, rootReducer);