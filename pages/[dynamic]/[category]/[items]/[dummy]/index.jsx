// import { useRouter } from "next/router"
// import { useEffect } from "react";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { MemoizedCartCounterComponent } from "../../../../../components/Header/cart-counter.component";
// import DeliveryDropdownComponent from "../../../../../components/Header/delivery-dropdown.component";
// import LeftMenuComponent from "../../../../../components/LeftMenu/leftmenu.component";
// import MenuItemAddToCartComponent from "../../../../../components/menu-item-details/menu-item-add-to-cart/menu-item-add-to-cart.component";
// import MenuItemDescription from "../../../../../components/menu-item-details/menu-item-description/menu-item-description.component";
// import MenuItemOptionsParameter from "../../../../../components/menu-item-details/menu-item-options-parameter/menu-item-options-parameter.component";
// import MenuItemToppingOptions from "../../../../../components/menu-item-details/menu-item-topping-options/menu-item-topping-options";
// import MenuItemToppingType from "../../../../../components/menu-item-details/menu-item-topping-type/menu-item-topping-type";
// import { addFavorite, deleteFavorite, removeMenuItemForFavorite, selectedMenuItem } from "../../../../../redux/menu-item/menu-item.action";
// import LoginMainComponent from "../../../../../components/login/login.component";
// import { useState } from "react";
// import { MemoizedMenuItemHeaderLogoComponent } from "../../../../../components/Header/menuitemheaderlogo.component";
// import BackHeaderComponent from "../../../../../components/Header/backheader.component";
// import { getCurrency } from "../../../../../components/helpers/utility";
// import { updaterestaurantsdetail } from "../../../../../redux/restaurants/restaurants.action";
// //import MenuItemToppingType1 from "../../../../components/menu-item-details/menu-item-topping-type/menu-item-topping-type1";

 const MenuItemDetail =() => {
     return(
         <div>dummy</div>
     )
 }
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const {
//         query: { dynamic, id, category, items },
//     } = router

//     const userinfo = useSelector(({ userdetail }) => userdetail?.loggedinuser, shallowEqual);
//     const restaurantinfo = useSelector(({ restaurant }) => restaurant?.restaurantdetail, shallowEqual);
//     const { logo, restaurantURL } = restaurantinfo;

//     let rewardpoints = useSelector(({ cart }) => cart?.rewardpoints);
//     // const [point, setpoint] = useState(rewardpoints?.rewardPoint);
//     // const [amount, setamount] = useState(parseFloat(rewardpoints?.rewardamount) > 0 ? parseFloat(rewardpoints?.rewardamount).toFixed(2) : 0);

//     const [amount, setamount] = useState(0.00);
//     const [point, setpoint] = useState(0);

//     const [currency, setcurrency] = useState(getCurrency());

//     let lstcarttopping = [];
//     let menuItemDetail = useSelector(({ menuitem }) => menuitem?.menuitemdetaillist);
//     let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.length > 0 && menuItemDetail.size.find(x => x.sizeselected === true);
//     let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && menuItemDetail.topping.find(x => x.subparameterId == selectedsize.subparameterId);
//     let selectedmenuitemdetail = useSelector(({ menuitem }) => menuitem?.selectedmenuitemdetail);



//     useEffect(() => {
//         if (dynamic && dynamic !== undefined) {
//             let restauranturl=dynamic.toLowerCase().toString().replace(/ /g, "-");
            
//             if(restauranturl)
//                 dispatch(updaterestaurantsdetail(restauranturl,restaurantinfo.defaultlocationId));
//         }
//     }, []);

//     useEffect(() => {
//         setTimeout(() => {
//             if (rewardpoints !== undefined && rewardpoints !== null) {
//                 setamount(parseFloat(rewardpoints.rewardamount));
//                 setpoint(rewardpoints.rewardPoint);
//             } else if (userinfo != undefined && userinfo) {
//                 setamount(parseFloat(userinfo.totalRewardPoints / userinfo.rewardvalue));
//                 setpoint(userinfo.totalRewardPoints);
//             } 
//         }, 500);
       
//     }, [userinfo]);

//     useEffect(() => {
//         if(selectedtopping && selectedtopping?.list){
//             selectedtopping.list != undefined && selectedtopping.list.length > 0 &&
//             selectedtopping.list.map((lsttop) => {
//                 lsttop.type != undefined && lsttop.type.length > 0 &&
//                     lsttop.type.map((type) => {
//                         if (type.subOptionselected === true) {
//                             lstcarttopping.push(type);
//                         }
//                     })
//             })
//         }
//     }, []);

//     const selectedFavoriteClick = (item) => {
//         let objdata = selectedmenuitemdetail;
//         objdata.isFavoriteMenu = item;
//         dispatch(removeMenuItemForFavorite());
//         dispatch(selectedMenuItem(objdata));

//         if (item === true) {
            
//             dispatch(addFavorite(userinfo.customerId.toString(), restaurantinfo.restaurantId, objdata.menuitemId != undefined ? objdata.menuitemId : objdata.menuitemid));
//         }
//         else {
//             dispatch(deleteFavorite(userinfo.customerId, restaurantinfo.restaurantId, objdata.menuitemId != undefined ? objdata.menuitemId : objdata.menuitemid));
//         }
//     }

//     const [showLogin, setShowLogin] = useState(false);

//     const logindetailsclick = () => {
//         if (userinfo === undefined || userinfo === null) {
//             setShowLogin(true);
//         }
//         else {
//             setShowLogin(false);
//         }
//     }

//     const sendDataToParent = (index) => {
//         if (index === true && (userinfo === undefined || userinfo === null)) {
//             setShowLogin(true);
//         }
//         else {
//             setShowLogin(false);
//         }
//     }

//     return (
//         <div>
//             <div className="container-fluid">
//                 <div className="row row-eq-height">
//                     <LeftMenuComponent />
//                     <div className="col-lg-9 pull-right p-2 right-content col-sm-9 col-xs-12">
//                         <div className="row">
//                             <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
//                                 <BackHeaderComponent />
//                                 <MemoizedMenuItemHeaderLogoComponent />
//                                 <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
//                                     <DeliveryDropdownComponent />
//                                     <MemoizedCartCounterComponent />
//                                 </div>

//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-lg-8 h1-margin col-sm-8 col-xs-12 small-text-center">
//                                 <h1>{menuItemDetail.itemName}</h1>
//                             </div>
//                             {(userinfo != undefined && userinfo != null) &&
//                                 <div className="col-lg-1 padding_right_50 margin_top_40 text-right col-sm-1 col-xs-12">
//                                     <a className={"red-heart d-inline-block color_red size_28"} onClick={() => selectedFavoriteClick(!selectedmenuitemdetail.isFavoriteMenu)}>
//                                         <i className={selectedmenuitemdetail.isFavoriteMenu === true ? "fa color_red fa-heart active" : "fa color_red fa-heart-o"}></i>
//                                     </a>
//                                 </div>}
//                             {(userinfo === undefined || userinfo === null) &&
//                                 <div className="col-lg-1 padding_right_50 margin_top_40 text-right col-sm-1 col-xs-12">
//                                     <a className={"red-heart d-inline-block color_red size_28"}
//                                         onClick={() => logindetailsclick()}
//                                         data-toggle="modal"
//                                         data-target="#myModal-logintest"
//                                     >
//                                         <i className={selectedmenuitemdetail.isFavoriteMenu === true ? "fa color_red fa-heart active" : "fa color_red fa-heart-o"}></i>
//                                     </a>
//                                 </div>}
//                         </div>
//                         <div className="row">
//                             <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
//                                 <div className="row">
//                                     <div className="col-lg-9 col-sm-12 col-xs-12">
//                                         <div className="row">
//                                             <MenuItemDescription />
//                                             {/* <MenuItemDetailAddToFavourites /> */}
//                                         </div>
//                                         <div className="row">
//                                             {/* <div className="col-lg-12 col-sm-12 col-xs-12">
//                                                 <hr className="gr" />
//                                             </div>
//                                             <MenuItemPizzaOptions /> */}
//                                             <div className="col-lg-12 col-sm-12 col-xs-12">
//                                                 <hr className="gr" />
//                                             </div>
//                                             <MenuItemOptionsParameter />

//                                             <div className="col-lg-6 col-sm-6 col-xs-12">
//                                                 <MenuItemToppingOptions />
//                                             </div>

//                                             <div>
//                                                 <MenuItemToppingType />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-3 rt-s flush col-sm-12 col-xs-12">
//                                         {userinfo != undefined && userinfo != null &&
//                                             <div className="col-lg-12 orange_div ora col-sm-12 col-xs-12 text-center removedLHeight">
//                                                 <div className="col-lg-12 col-sm-12 col-xs-12 text-center">
//                                                     {/* <div className="color_white size_15">You have <em>{userinfo && userinfo.totalRewardPoints}</em> reward points, <br />worth <em className="color_white size_24">${userinfo.totalRewardPoints/userinfo.rewardvalue}</em><br /><em className="sm  color_white width_100">You can redeem {RewardItem.REWARD_POINT} points or {RewardItem.REWARD_AMOUNT}</em></div>*/}
//                                                     <div className="color_white size_15">You have <em>{point}</em> reward points, <br />worth <em className="color_white size_24">{currency} {amount.toFixed(2)}</em><br /><em className="sm  color_white width_100">You can redeem {point} points or {amount}</em></div>
//                                                 </div>
//                                             </div>}
//                                         <MenuItemAddToCartComponent
//                                             //selectedsize={selectedsize}
//                                             ctopping={lstcarttopping}
//                                             sendDataToParent={sendDataToParent}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
//         </div>
//     )
// }

 export default MenuItemDetail;