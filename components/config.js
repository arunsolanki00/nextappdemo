
export let BASE_URL;
export const PROD_URL = "";
export const DEV_URL = `https://fudme-web-dev.azurewebsites.net`;
//export const LOCAL_URL = `http://localhost:60876`;
export const LOCAL_URL = `http://localhost/fudme`;

BASE_URL = DEV_URL;
const proxy = "";

export const ENDPOINTS = {
    PROXY: `${proxy}`,
    BASE_URL: `${BASE_URL}`,

    GET_RESTAURANTS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllRestaurantInfo`,
    GET_MENU_CATEGORY: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getMenuCategory_Version2`,
    GET_ALL_MENU_ITEMS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllMenuItems`,
    GET_MENU_ITEMS_DETAILS: `${BASE_URL}/RestaurantAPIOnlineV2.asmx/getMenuItemDetail`,
    ADD_FAVORITE: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/addFavorite`,
    DELETE_FAVORITE: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/DeleteFavorite`,
    ADD_ITEM_TO_CART: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/addToCart`,
    GET_CART_ITEM: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getCartItems`,
    GET_ALL_FAVORITES: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getMenuItemFavorite_Version1`,
    LOGIN: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/loginVerification`,
    REGISTER: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/registerUser`,
    GET_LOCATIONS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllLocationInfoWeb`,
    //`${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllLocationInfoNew`,
    GET_CART_ITEM_COUNT: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getCartItemsCount`,
    DELETE_CART_ITEM: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/removeCartItem`,
    GET_LOCATION_TIMMING: `${BASE_URL}/RestaurantAPIOnlineV2.asmx/GetRestaurantDeliveryTakeOutTime`,
    GET_TODAY_RESTAURANTHOURS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getTodayOpenCloseTime`,
    CHECK_CUSTOMER_REWARD_POINTS: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/checkCustomerRewardPoints`,
    UPDATE_QUANTITY: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/updateCartItem`,
    GET_CART_TOTAL: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getCartItemsTotal`,
    GET_ORDER_HISTORY: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getOrderHistory`,
    CHECK_ORDER_TIME: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/checkTime`,
    GET_DELIVERY_CHARGES: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getDeliveryChargesInfo`,
    CART_CHECKOUT: `${BASE_URL}/`,
    GET_TESTIMONIALS: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getTestimonialOfRestaurant`,
    ADD_TESTIMONIALS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/addTestimonial`,
    GET_ALL_LOCATION_List: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllLocationList`,
    GET_ALL_NOTIFICATION_List: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getNotification`,
    GET_ORDER_INFO: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getOrderDetailsInfo`,
    REPEAT_ORDER: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/repeatOrder`,
    GET_PAYMENT_INTENT_ID: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getPaymentIntent`,
    CONFIRM_STRIPE_PAYMENT: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/confirmCardPayment`,
    GET_DELIVERY_ADDRESS: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getDeliveryAddress_Version1`,
    // ADD_DELIVERY_ADDRESS: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/addDeliveryAddresss_V1`,
    ADD_DELIVERY_ADDRESS: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/addDeliveryAddresss`,

    DELETE_DELIVERY_ADDRESS: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/deleteDeliveryAddress`,
    GET_CUSTOMER_PASSWORD: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getCustomerPassword`,
    UPDATE_CUSTOMER: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/addUpdateCustomerV3`,
    GET_CUSTOMER_INFO: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getCustomerDetails`,
    CHECKOUT_ORDER: `${BASE_URL}/RestaurantAPIOnlineV1.asmx/getCustomerDetails`,
    PLACE_ORDER: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/addOrdersWeb`,
    COUNTRY_LIST: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllCountryList`,
    GET_ORDER_TIME: `${BASE_URL}/RestaurantAPIOnlineV2.asmx/GetOrderTime`,
    GET_SELECTED_RESTAURANT_TIME: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getSelectedRestaurantTime`,
    ADD_ORDER: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/addOrder`,
    USER_EXIST: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/userExists`,
    FORGOT_PASSWORD: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/forgotPassword`,
    RESET_PASSWORD_VALIDTOKEN: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/resetPasswordValidTokenRequest`,
    RESET_PASSWORD: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/resetpasswordRequest`,
    LOCATION_BY_ID: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getLocationInfoById`,
    OTP_VERIFICATION_SETTING: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getOTPVerificationSetting`,
    TWILIO_SEND_CODE: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/twilioSendCode`,
    TWILIO_VERIFY_CODE: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/twilioVerifyCode`,
    GET_RESTAURANT_LOCATIONS_LIST: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getAllRestaurantAndLocationDetail`,
    DELETE_CART_FROM_SESSIONID: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/removeCartItemFromSessionId`,
    GET_TIMING: `${BASE_URL}/RestaurantAPIOnlineWebV1.asmx/getTiming`,
    GOOGLE_MAP_LINK: "https://maps.google.com/?q=",
}
