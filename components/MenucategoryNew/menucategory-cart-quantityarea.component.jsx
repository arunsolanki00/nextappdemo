import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getCartItemCount, updateCartItemCount } from '../../redux/cart/cart.action';
import { getCategoryItemList } from '../../redux/category/category.action';
import { selectedMenuItem } from '../../redux/menu-item/menu-item.action';
import { MenuItemServices } from '../../redux/menu-item/menu-item.services';
import { MenuItemTypes } from '../../redux/menu-item/menu-item.types';
import { createSessionId } from '../../redux/session/session.action';
import { getSessionKey } from '../Common/auth';
import { FormatOrderObject } from '../Common/format-order-object';
import handleNotify from '../helpers/toaster/toaster-notify';
import { ToasterPositions } from '../helpers/toaster/toaster-positions';
import { ToasterTypes } from '../helpers/toaster/toaster-types';
import LoginMainComponent from '../login/login.component';
import { v4 as uuidv4 } from 'uuid';
function CartQuantityArea(props) {
    const { cartdetails, menuitem } = props;
    let [currentQty, setcurrentQty] = useState(1);
    const [tempqty, settempqty] = useState(0);
    const [minQty, setminQty] = useState(1);
    const [showLogin, setShowLogin] = useState(false);
    const [disablequentity, setdisablequentity] = useState(1);
    const [isdecrement, setisdecrement] = useState(false);

    const [activeClass, setactiveClass] = useState("active");
    const router = useRouter();
    let isenable = false;
    const dispatch = useDispatch();
    const deliveryaddressinfo = useSelector(({ selecteddelivery }) => selecteddelivery);
    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    let session = useSelector(({ session }) => session)
    let sessionidObj = session?.sessionid;
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    let cartsessionid = sessionidObj;
    //getSessionKey(restaurantinfo.restaurantId, customerId, restaurantinfo.defaultlocationId);
    const location = restaurantinfo.defaultLocation;

    let defaultQuantity = 1;
    const IsOrderDisable = () => {

        // if (location && ((location.isOrderingDisable == true) ||
        // 	(deliveryaddressinfo.pickupordelivery === "Pickup" && location.isTakeoutOrderingDisable === true) ||
        // 	(deliveryaddressinfo.pickupordelivery === "Delivery" && location.isDeliveryOrderingDisable === true))) {
        // 	return true;
        // }
        // else return false;
        if (location && (location.isOrderingDisable == true)) {
            return <></>;
        }
        else {
            if (deliveryaddressinfo && deliveryaddressinfo.pickupordelivery === "Pickup" && location.isTakeoutOrderingDisable === true) {
                return;
            } else if (deliveryaddressinfo && deliveryaddressinfo.pickupordelivery === "Delivery" && location.isDeliveryOrderingDisable === true) {
                return <></>;
            } else {
                return (
                    // userinfo !== undefined && userinfo != null ?
                    <a onClick={() => addtocartclick(menuitem)} className="blue_btn size_22">Add to Cart</a>
                    // :
                    // <a className="blue_btn size_22" data-toggle="modal" data-target="#myModal-logintest" onClick={logindetailsclick}> Add to Cart
                    // </a>
                )
            }
        }
    }
    // const increment = () => {
    //     
    //     const plusState = currentQty + 1;
    //      setcurrentQty(plusState);
    //     newqty=plusState;
    // };

    // const decrement = () => {
    //     if (minQty === currentQty) {
    //         setcurrentQty(minQty);
    //         return <></>;
    //     }
    //     const minusState = currentQty - 1;
    //     setcurrentQty(minusState);
    // };
    const addtocartclick = (item) => {

        dispatch(selectedMenuItem(item));
        MenuItemServices.getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, customerId, item.menuitemId, cartsessionid, 0).then(response => {
            if (response) {
                //save selected menu item with topping and size
                dispatch(getCategoryItemList(restaurantinfo.restaurantId, item.catId, customerId, restaurantinfo.defaultlocationId));

                let menuItemDetail = response;
                let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size?.filter(x => x.sizeselected == true);
                let selectedtopping = selectedsize && selectedsize.length > 0 && menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && menuItemDetail.topping.filter(x => x.subparameterId == selectedsize[0].subparameterId);
                let selectedoption = selectedtopping.length > 0 && selectedtopping[0].list?.filter(x => x.isCompulsory == true);

                let objselectedItem = item;
                let total = selectedsize != undefined && selectedsize.length > 0 &&
                    selectedsize[0].price;

                
                // if (deliveryaddressinfo && (
                //     deliveryaddressinfo.pickupordelivery === "Pickup" ||
                //     (deliveryaddressinfo.pickupordelivery === "Delivery" &&
                //         deliveryaddressinfo.selecteddeliveryaddress && deliveryaddressinfo.selecteddeliveryaddress != null))) {
                if (deliveryaddressinfo && (
                    deliveryaddressinfo.pickupordelivery === "Pickup" ||
                    (deliveryaddressinfo.pickupordelivery === "Delivery"))) {
                    if (menuItemDetail.topping != undefined && menuItemDetail.topping.length > 0 && selectedoption.length === 0) {
                        let itemobj = FormatOrderObject(restaurantinfo, objselectedItem, menuItemDetail, customerId, total, currentQty, cartsessionid);
                        if (itemobj != undefined) {
                            MenuItemServices.addItemToCart(itemobj, restaurantinfo.restaurantId).then(response => {

                                dispatch({ type: MenuItemTypes.ADD_ITEM_TO_CART, payload: response });
                                if (response) {
                                    dispatch(updateCartItemCount());
                                    dispatch(getCartItemCount(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, customerId));
                                }
                            })
                        }
                    }
                }
                else {
                    handleNotify('Please choose delivery address', ToasterPositions.BottomRight, ToasterTypes.Error);
                }
            }
        });
    }

    const logindetailsclick = () => {
        if (userinfo === undefined || userinfo === null) {
            setShowLogin(true);
        }
        else {
            setShowLogin(false);
        }
    }
    var itemRow = cartdetails?.filter(item => item.menuitemid === menuitem.menuitemId);
    var cartSelectedQuantity = 0;
    if (itemRow?.length > 0) {
        cartSelectedQuantity = itemRow[0].qty;
        //currentQty = cartSelectedQuantity;
        //defaultQuantity = cartSelectedQuantity;
    }
    const increment = () => {
        setactiveClass("active");
        //const plusState = tempqty > 0 ? tempqty + 1 : cartSelectedQuantity + 1;
        //  setcurrentQty(plusState);
        //  currentQty=plusState;
        // defaultQuantity = plusState;

        // settempqty(plusState);
        // if (plusState > 1) {
        //     isenable = true;
        // }
        // setisdecrement(false);

        if (cartSelectedQuantity > 0 && currentQty == 1) {
            if (isdecrement === true && currentQty === 1) {
                cartSelectedQuantity = 1;
            }
            setcurrentQty(cartSelectedQuantity + 1)
        }
        else {
            setcurrentQty(currentQty + 1);
        }
        // }else{

        // }
        // setcurrentQty(currentQty>=1  ? currentQty + 1:cartSelectedQuantity + 1);

    };

    const decrement = () => {
        if (currentQty === 2) {
            setactiveClass("disabled");
        }
        if (currentQty === 1 && cartSelectedQuantity === 2) {
            setactiveClass("disabled");
        }
        if (isdecrement === true) {
            if (minQty === currentQty) {
                setcurrentQty(minQty);
                return <></>;
            }
        }

        // const minusState = tempqty > 0 ? tempqty - 1 : currentQty - 1;
        // // setcurrentQty(minusState);
        // // qu=minusState;
        // settempqty(minusState);

        //         if (currentQty == 1) {
        //             setcurrentQty(1)
        //             return;
        //         }
        // else{
        setisdecrement(true);
        if (cartSelectedQuantity > 0 && currentQty == 1) {
            setcurrentQty(cartSelectedQuantity - 1)
        }
        else {
            let qty = currentQty - 1;

            setcurrentQty(currentQty - 1);
            console.log(currentQty)
        }
        //}

    };
    // var qtyNew= cartdetails?.cartItemDetails.map(item=>{

    //     if(menuitem.menuitemid === item.menuitemId){
    //         console.log("matched",item.itemname)
    //          setcurrentQty(item.qty);
    //     }
    //     else{
    //         console.log("notmatched",item.itemname)
    //         //setcurrentQty(1);
    //     }
    // })


    return (
        <div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12 margin_top_20">


                {/* <div className="quantity">
                    <button onClick={() => decrement()} className={defaultQuantity>1 || tempqty > 1  ? "active" : "disabled"}>-</button>
                    <input data-value type="text" readOnly value={tempqty > 0 ? tempqty : defaultQuantity} />
                    <button onClick={() => increment()} className="active">+</button>
                </div> */}

                <div className="quantity">
                    {/* <button onClick={() => decrement()} className={cartSelectedQuantity > 1 || tempqty > 1 ? "active" : "disabled"}>-</button> */}
                    {/* <input data-value type="text" readOnly value={cartSelectedQuantity > 0 ? cartSelectedQuantity : currentQty} /> */}
                    {/* <input data-value type="text" readOnly value={currentQty >= 1 && cartSelectedQuantity ==0 ? currentQty: cartSelectedQuantity } /> */}

                    <button onClick={() => decrement()} className={currentQty > 1 || cartSelectedQuantity > 1 ? activeClass : "disabled"}>-</button>
                    {
                        (currentQty === 1 && cartSelectedQuantity > 1 && isdecrement === true) ? <input data-value type="text" readOnly value={currentQty} /> :

                            <input data-value type="text" readOnly value={currentQty > 1 ? currentQty : cartSelectedQuantity > 1 ? cartSelectedQuantity : 1} />
                    }
                    <button onClick={() => increment()} className="active">+</button>
                </div>
                <div className="add-to-cart">
                    {/* {
                        (userinfo === undefined || userinfo === null) ?
                            <a className="blue_btn size_22" data-toggle="modal" data-target="#myModal-logintest" onClick={logindetailsclick}> Add to Cart
                            </a>
                            :
                            <a onClick={() => addtocartclick(menuitem)} className="blue_btn size_22">Add to Cart</a>
                    } */}
                    <IsOrderDisable />
                </div>
                {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
            </div>
        </div>
    )
}

export default CartQuantityArea;