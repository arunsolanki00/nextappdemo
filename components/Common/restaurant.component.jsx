
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { clearCartItems, emptycart, getCartItem } from '../../redux/cart/cart.action';
import { getCategoryItemList, selectedCategory } from '../../redux/category/category.action';
import { logout } from '../../redux/login/login.action';
import { getSelectedRestaurantTime } from '../../redux/main/main.action';
import { MainServices } from '../../redux/main/main.services';
import { MainTypes } from '../../redux/main/main.types';
import { restaurantsdetail } from '../../redux/restaurants/restaurants.action';
import { RestaurantsServices } from '../../redux/restaurants/restaurants.services';
import { clearSessionId, createSessionId } from '../../redux/session/session.action';
import { ENDPOINTS } from "../config";
import { getLocationIdFromStorage, getRestaurantIdFromStorage, setLocationIdInStorage, setRestaurantIdInStorage } from './localstore';
import { v4 as uuidv4 } from 'uuid';

function Restaurant({ children }) {

    const router = useRouter();
    const dispatch = useDispatch();
    let newselectedRestaurant = null;
    let categoryresponse = [];
    const { query: { dynamic }, } = router;
    const [loadrestaurant, setLoadrestaurant] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const customerId = userinfo ? userinfo.customerId : 0;
    let cart = useSelector(({ cart }) => cart);

    let sessionId = useSelector(({ session }) => session.sessionid);
    // const setLocation = (restaurantId,defaultlocationId) => {
    //     localStorage.setItem('defaultlocationId', defaultlocationId > 0 ? defaultlocationId : 0);
    //     localStorage.setItem('restaurantId', restaurantId > 0 ? restaurantId : 0);
    //  };


    useEffect(() => {
        if (router.pathname !== '/home') {
            // document.documentElement.style.setProperty(
            //     "--primary-color-orange",
            //     "#FF7332"
            // );
            if (dynamic && dynamic !== undefined) {
                //setSelectedRestaurant(null);
                let restauranturl = dynamic.toLowerCase().toString().replace(/ /g, "-");

                // if(restaurantinfo !== null && restaurantinfo !== undefined && restaurantinfo.restaurantURL === restauranturl && restaurantinfo.defaultlocationId){

                let defaultlocationId = getLocationIdFromStorage(); //localStorage.getItem('defaultlocationId');
                let restaurantId = getRestaurantIdFromStorage(); // localStorage.getItem('restaurantId');

                var isSameRestaurant;
                RestaurantsServices.getRestaurantsList(restauranturl, defaultlocationId !== null && defaultlocationId).then(response => {
                    if (response) {
                        newselectedRestaurant = response[0];
                        // if(response.length > 1){
                        //     newselectedRestaurant = dynamic != undefined ?
                        //     response.find(item =>
                        //         (item.restaurantURL.toLowerCase().trim().toString().replace(/ /g, "-") === dynamic.toLowerCase().toString().replace(/ /g, "-"))) : null;
                        // }

                        console.log(newselectedRestaurant);
                        if (newselectedRestaurant) {

                            let selectedColor = newselectedRestaurant.color == undefined || newselectedRestaurant.color == null ? '#FF7332' : newselectedRestaurant.color;
                            console.log(selectedColor);

                            document.documentElement.style.setProperty(
                                "--primary-color-orange",
                                selectedColor
                            );

                            isSameRestaurant = newselectedRestaurant.restaurantId === restaurantId ? true : false;
                            if (!isSameRestaurant) {
                                //clear old session
                                dispatch(clearSessionId());
                                //create new session id
                                let id = uuidv4();
                                dispatch(createSessionId(id))
                            } else {
                                if (sessionId === null || sessionId === undefined) {
                                    //create new session id
                                    let id = uuidv4();
                                    dispatch(createSessionId(id))
                                }
                            }


                            //setLocation(newselectedRestaurant.restaurantId,newselectedRestaurant.defaultlocationId);
                            setLocationIdInStorage(newselectedRestaurant.defaultlocationId);
                            setRestaurantIdInStorage(newselectedRestaurant.restaurantId);

                            MainServices.getMenuCategoryList(newselectedRestaurant.restaurantId, newselectedRestaurant.defaultlocationId).then(catresponse => {
                                if (catresponse && catresponse != null && catresponse.length > 0) {
                                    categoryresponse = catresponse;
                                    dispatch({
                                        type: MainTypes.GET_MENU_CATEGORY_DATA,
                                        payload: categoryresponse
                                    })
                                    const firstCategory = catresponse[0]; // take first category
                                    firstCategory.catSelected = true;
                                    dispatch(selectedCategory(firstCategory));
                                    dispatch(getCategoryItemList(newselectedRestaurant.restaurantId, firstCategory.catId, customerId, newselectedRestaurant.defaultlocationId));

                                    let promotioncategories = catresponse.find(x => x.catName === 'PROMOTION');
                                    let promotionCatId = 0;
                                    if (promotioncategories) {
                                        promotionCatId = promotioncategories.catId;

                                        MainServices.getPromotionCategoryList(newselectedRestaurant.restaurantId, promotionCatId, customerId,
                                            newselectedRestaurant.defaultlocationId).then(promocatresponse => {
                                                if (promocatresponse && promocatresponse != null) {
                                                    dispatch({
                                                        type: MainTypes.GET_PROMOTION_CATEGORY_DATA,
                                                        payload: promocatresponse
                                                    })
                                                }
                                                //setPromotionsData(promocatresponse);
                                            });
                                    } else {
                                        dispatch({
                                            type: MainTypes.UPDATE_PROMOTION_CATEGORY_DATA,
                                            payload: null
                                        })
                                    }
                                }
                                dispatch(restaurantsdetail(newselectedRestaurant));
                                //dispatch(getSelectedRestaurantTime(newselectedRestaurant.restaurantId, newselectedRestaurant.defaultlocationId));
                                setSelectedRestaurant(newselectedRestaurant);
                                if (newselectedRestaurant.restaurantId > 0 && userinfo) {
                                    if (userinfo.restaurantId !== newselectedRestaurant.restaurantId) {
                                        dispatch(logout());

                                        // //clear old session
                                        // dispatch(clearSessionId());

                                        // //create new session id
                                        // let id = uuidv4();
                                        // dispatch(createSessionId(id))
                                    }
                                }
                                // console.log("comaparesion",cart?.cartitemdetail.cartDetails.cartItemDetails[0].restaurantId!=newselectedRestaurant.restaurantId)

                                if ((cart?.cartitemdetail?.cartDetails?.cartItemDetails[0]?.restaurantId != newselectedRestaurant.restaurantId) &&
                                    (cart?.cartitemdetail?.cartDetails?.cartItemDetails[0]?.locationid != newselectedRestaurant.defaultLocation.locationId)) {

                                    dispatch(emptycart())

                                    //  //clear old session
                                    //  dispatch(clearSessionId());
                                    // //create new session id
                                    // let id = uuidv4();
                                    // dispatch(createSessionId(id))
                                }


                                // if(sessionId===null||sessionId===undefined){
                                //       //create new session id
                                //       let id = uuidv4();
                                //       dispatch(createSessionId(id)) 
                                // }
                                setLoadrestaurant(true);
                            })
                        }
                        else {
                            setSelectedRestaurant(newselectedRestaurant);
                            setLoadrestaurant(true);
                        }
                    }
                }
                )
                //}
            }
        }
    }, [dynamic]);

    console.log(router.pathname)

    if (loadrestaurant && selectedRestaurant) {
        return (
            <>
                {/* <LoadCategory selectedRestaurant={selectedRestaurant} /> */}
                <Head>
                    <title>{selectedRestaurant.restaurantname}: Online Ordering</title>
                    <description>{selectedRestaurant.restaurantname}: Online Ordering Description</description>
                </Head>
                {children}

            </>
        )
    }
    else if (router.pathname === '/home' || router.pathname === '/' || router.pathname === '') {
        console.log(router.pathname)
        return (
            <>
                {children}
            </>
        )
    }
    // else if (loadrestaurant && !selectedRestaurant) {
    //     return (
    //         <>
    //             <Error statusCode="404" title="Wrong restaurant" />
    //         </>
    //     )
    // }
    else {
        return (
            <>
                Loading...
            </>
        );
    }
}

// Restaurant.getInitialProps = async (ctx) => {

//     let responseclass = {
//         result: {},
//         status: "",
//         message: ""
//     }

//     const location = ENDPOINTS.GET_RESTAURANTS;
//     const config = {
//         headers: {
//             'content-type': 'multipart/form-data',
//         }
//     };
//     try {
//         let response = await axios.post(location, config);
//         responseclass = await JSON.parse(response.data.d);
//         if (responseclass.result != null && responseclass.status === 1) {
//             let restaurants = responseclass.result;
//             return { restaurants };
//         }
//     } catch (error) {
//         return { error };
//     }
// }

// export async function getServerSideProps({ query }) {

//     const id = query.dynamic;
//     let response = [];
//     let responseclass = {
//         result: {},
//         status: "",
//         message: ""
//     }

//     const location = ENDPOINTS.GET_RESTAURANTS;
//     const config = {
//         headers: {
//             'content-type': 'multipart/form-data',
//         }
//     };

//     try {
//         let response = await axios.post(location, config);
//         responseclass = await JSON.parse(response.data.d);

//         if (responseclass.result != null && responseclass.status === 1) {
//             response = responseclass.result;
//         }
//     }
//     catch (e) {

//     }

//     if (response) {
//         let selectedRestaurant = null;
//         selectedRestaurant = id != undefined ?
//             response.filter(item =>
//                 (item.restaurantURL.toLowerCase().trim().toString().replace(" ", "-") === id.toLowerCase().toString().replace(" ", "-"))) : null;

//         return { stars: selectedRestaurant[0] }
//     }

//     // RestaurantsServices.getRestaurantsList().then(response => {
//     //     
//     //     if (response) {
//     //         let selectedRestaurant = null;
//     //         selectedRestaurant = id != undefined ?
//     //             response.filter(item =>
//     //                 (item.restaurantURL.toLowerCase().trim().toString().replace(" ", "-") === id.toLowerCase().toString().replace(" ", "-"))) : null;

//     //         return { stars: selectedRestaurant[0] }

//     //     }
//     // });
//     return { stars: null }
// }

export default (Restaurant)
