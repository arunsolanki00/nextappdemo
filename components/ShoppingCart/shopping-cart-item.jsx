import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';
import { getMenuItemList, selectedMenuItem } from '../../redux/menu-item/menu-item.action';
import { getSessionKey } from '../Common/auth';
import { useRouter } from 'next/router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteCartItem, getCartItem, getCartItemCount, updateCartItemCount, updateCartItem, setCartItem, updatequantity, carttotaldata, updatecarttotaldata, setrewardpoint, orderinstruction } from '../../redux/cart/cart.action';
import { CartServices } from '../../redux/cart/cart.services';
import { CartTypes } from '../../redux/cart/cart.types';
import { MyOrderServices } from '../../redux/myorders/myorders.services';
import { MenuItemServices } from '../../redux/menu-item/menu-item.services';
import { MenuItemTypes } from '../../redux/menu-item/menu-item.types';

const ShoppingCartItem = (cartdata) => {
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const categoryItemList = useSelector(({ category }) => category.categoryitemlist);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    let customerId=userinfo ? userinfo.customerId : 0;
    const deliveryaddressinfo = useSelector(({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress);
    const [minQty, setminQty] = useState(1);
    const [cartdeleteconfirm, setcartdeleteconfirm] = useState(false);
    const [deleteitem, setdeleteitem] = useState(null);
    var rewardpoints = useSelector(({ cart }) => cart.rewardpoints);
    let carttotal = useSelector(({ cart }) => cart.carttotal);
    let sessionid = useSelector(({ session }) => session?.sessionid);
    const pickupordelivery = useSelector(({ selecteddelivery }) => selecteddelivery.pickupordelivery);

    const router = useRouter();
    const { query: { dynamic, location,id, category, index }, } = router;

    const editcartclick = async (item, menucategoryitem, menuitemnameurl) => {
        if (item != undefined) {
            // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, customerId,restaurantinfo.defaultlocationId);

            MenuItemServices.getMenuItemList(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, customerId, item.menuitemid, sessionid, item.cartid).then((response) => {

                if (response) {
                    dispatch({
                        type: MenuItemTypes.MENU_ITEM_DETAIL_LIST,
                        payload: response
                    });
                    dispatch(selectedMenuItem(item));
                    if(item.isdefaultprice === true && item.pricetypeid === 0){
                        router.push("/" + dynamic + "/"+location+"/" + menucategoryitem)

                    }else{
                        router.push("/" + dynamic+ "/"+location+ "/" + menucategoryitem + "/" + menuitemnameurl);
                    }
                }
            });
        }
    }

    const deletecartclick = (item) => {
        if (item != undefined) {
            setcartdeleteconfirm(true);
            setdeleteitem(item);

            // clearRedeemPoint();
        }
    }

    const clearRedeemPoint = () => {
        // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, customerId,restaurantinfo.defaultlocationId);

        CartServices.checkCustomerRewardPoints(
            restaurantinfo.restaurantId, customerId, 0, 0).then((response) => {
                if (response.status == 1) {
                    let rewards = {
                        rewardvalue: rewardpoints.rewardvalue,
                        rewardamount: (userinfo.totalRewardPoints / rewardpoints.rewardvalue - 0).toFixed(2),
                        rewardPoint: userinfo.totalRewardPoints - 0,
                        totalRewardPoints: userinfo.totalRewardPoints,
                        redeemPoint: 0,
                    };

                    dispatch(setrewardpoint(rewards));
                    dispatch(carttotaldata(sessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, customerId, 0, 0, 0, carttotal.tipPercentage,
                        carttotal.tipAmount, pickupordelivery === "Delivery" &&
                        deliveryaddressinfo &&
                    deliveryaddressinfo.deliveryaddressId
                    ));
                }
            });
    }

    const handleClickDelete = () => {
        if (deleteitem != undefined) {
            // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, userinfo.customerId,restaurantinfo.defaultlocationId);
           
            if(rewardpoints?.redeemPoint > 0){
            clearRedeemPoint();
           }
            
            CartServices.deleteCartItem(sessionid, deleteitem.cartid, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId).then(response => {
                if (response) {
                    dispatch({ type: CartTypes.DELETE_CART_ITEM, payload: response });
                    dispatch(updateCartItem());
                    dispatch(updateCartItemCount());
                    orderinstruction("");
                    let redeemPoint = rewardpoints?.redeemPoint > 0 ? parseInt(rewardpoints?.redeemPoint) : 0;
                    let redeemAmount = 0;
                    if (redeemPoint > 0) {
                        redeemAmount = rewardpoints?.redeemPoint / rewardpoints?.rewardvalue;
                    }

                    dispatch(getCartItem(sessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, customerId, 0, 0,
                        deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
                    dispatch(getCartItemCount(sessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, customerId));
                }
            })
            setcartdeleteconfirm(false);

        }
    }

    const increment = async (currentQty, cartid) => {
        const plusState = currentQty + 1;
        let dcart = [];
        let cdetail = cartdata;
        cartdata.cartdata.cartDetails.cartItemDetails.map((data) => {
            if (data.cartid === cartid) {
                data.qty = plusState;
                data.totalprice = data.unitprice * data.qty;
            }
            dcart.push(data);
        });
        cdetail.cartdata.cartDetails.cartItemDetails = dcart;

        dispatch(updateCartItem());
        dispatch(setCartItem(cdetail.cartdata));
        // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, userinfo.customerId,restaurantinfo.defaultlocationId);
        dispatch(updatequantity(sessionid, cartid, plusState, 0, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId));
        //dispatch(updatecarttotaldata());
        // dispatch(getCartItem(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, userinfo.customerId, 0, 0,
        //     deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
        //setTimeout(() => { dispatch(carttotaldata(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, userinfo.customerId, deliveryaddressinfo.deliveryaddressId)); }, 300);

        let redeemPoint = rewardpoints?.redeemPoint > 0 ? parseInt(rewardpoints?.redeemPoint) : 0;
        let redeemAmount = 0;
        if (redeemPoint > 0) {
            redeemAmount = rewardpoints?.redeemPoint / rewardpoints?.rewardvalue;
        }

        setTimeout(() => {
            dispatch(
                carttotaldata(
                    sessionid,
                    restaurantinfo.defaultlocationId,
                    restaurantinfo.restaurantId,
                    customerId,
                    0,
                    redeemPoint,
                    redeemAmount,
                    carttotal.tipPercentage,
                    carttotal.tipAmount,
                    deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
        }, 300);
    };

    const decrement = (currentQty, cartid) => {
        if (minQty === currentQty) {
            return;
        }
        const minusState = currentQty - 1;
        let dcart = [];
        let cdetail = cartdata;
        cartdata.cartdata.cartDetails.cartItemDetails.map((data) => {
            if (data.cartid === cartid) {
                data.qty = minusState;
                data.totalprice = data.unitprice * data.qty;
            }
            dcart.push(data);
        });
        cdetail.cartdata.cartDetails.cartItemDetails = dcart;

        dispatch(updateCartItem());
        dispatch(setCartItem(cdetail.cartdata));
        // const cartsessionid = getSessionKey(restaurantinfo.restaurantId, userinfo.customerId,restaurantinfo.defaultlocationId);
        dispatch(updatequantity(sessionid, cartid, minusState, 0, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId));
        //dispatch(updatecarttotaldata());
        // dispatch(getCartItem(cartsessionid, restaurantinfo.defaultlocationId, restaurantinfo.restaurantId, 0, userinfo.customerId, 0, 0,
        //     deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));

        let redeemPoint = rewardpoints?.redeemPoint > 0 ? parseInt(rewardpoints?.redeemPoint) : 0;
        let redeemAmount = 0;
        if (redeemPoint > 0) {
            redeemAmount = rewardpoints?.redeemPoint / rewardpoints?.rewardvalue;
        }

        setTimeout(() => {
            dispatch(
                carttotaldata(
                    sessionid,
                    restaurantinfo.defaultlocationId,
                    restaurantinfo.restaurantId,
                    customerId,
                    0,
                    redeemPoint,
                    redeemAmount,
                    carttotal.tipPercentage,
                    carttotal.tipAmount,
                    deliveryaddressinfo && deliveryaddressinfo.deliveryaddressId ? deliveryaddressinfo.deliveryaddressId : 0));
        }, 300);

    };

    if (categoryItemList != undefined)
        return (
            <>
                {cartdata && cartdata.cartdata.cartDetails != undefined &&
                    cartdata.cartdata.cartDetails.cartItemDetails != undefined &&
                    cartdata.cartdata.cartDetails.cartItemDetails &&
                    cartdata.cartdata.cartDetails.cartItemDetails.length > 0 &&
                    cartdata.cartdata.cartDetails.cartItemDetails.map((data, index) => {
                        let stroptiondataname = "";
                        let optionlength = cartdata.cartdata.cartDetails.cartOptionParams.filter(x => x.cartid === data.cartid).length;

                        cartdata.cartdata.cartDetails.cartOptionParams.filter(x => x.cartid === data.cartid).map((cdata, index) => {
                            if (cdata.cartid === data.cartid) {
                                if (optionlength - 1 === index) {
                                    var size = cdata.pizzaside === "L" ? " (Left)" : (cdata.pizzaside === "R" ? " (Right)" : "");
                                    stroptiondataname = stroptiondataname + cdata.quantity + ' x ' + cdata.title + size;
                                }
                                else {
                                    var size = cdata.pizzaside === "L" ? " (Left)" : (cdata.pizzaside === "R" ? " (Right)" : "");
                                    stroptiondataname = stroptiondataname + cdata.quantity + ' x ' + cdata.title + size + ", ";
                                }
                            }
                        });
                        let menucategoryitem = data.categoryname.toLowerCase().toString().replace(/ /g, "-");
                        let menuitemnameurl = data.itemname.toLowerCase().toString().replace(/ /g, "-");

                        return (
                            <div key={Math.random()}>
                                <div className="row">
                                    <div className="col-lg-2 flush xsnoflush text-center col-sm-3 col-xs-12">
                                        <div className="col-lg-12 flush text-center col-sm-12 col-xs-12">
                                            <img src={data.imgUrl} className="itemimage" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-10 col-lg-offset-0 flush xsnoflush col-sm-9 col-xs-10 col-xs-offset-1">
                                        <div className="itembox">
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <h3>
                                                    {/* <Link
                                                        shallow={false}
                                                        key={Math.random()}
                                                    href="/[dynamic]/[category]/[items]"
                                                    as={`/${dynamic}/${menucategoryitem}/${menuitemnameurl}`}
                                                    > */}
                                                    <a title='Click here to edit cart item' className="blue_btn edit_btn" onClick={() => editcartclick(data, menucategoryitem, menuitemnameurl)}><i className="fa fa-pencil"></i> Edit</a>
                                                    {/* </Link> */}
                                                    <a
                                                        style={{ float: "right" }}
                                                        className="delete"
                                                        data-dismiss="modal"
                                                        data-toggle="modal"
                                                        data-target="#cartdeleteconfirmmodel"
                                                        onClick={() => deletecartclick(data)}
                                                    ><img src="/images/bin-1.svg" />
                                                    </a>
                                                </h3>
                                            </div>
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <h3 className="color_black margin_bottom_10">{data.itemname + " - " + data.subparametername}</h3>
                                                <p>{stroptiondataname}</p>
                                            </div>
                                            {/* <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <hr className="grd" />
                                            </div> */}
                                        </div>
                                        <div className="col-lg-4 text-left col-sm-4 col-xs-12">
                                            <div className="quantity">
                                                <button onClick={() => decrement(data.qty, data.cartid)}
                                                    className={data.qty > 1 ? "active" : "disabled"}
                                                >-</button>
                                                <input data-value type="text" readOnly value={data.qty} />
                                                <button onClick={() => increment(data.qty, data.cartid)} className="active">+</button>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 text-left flush col-sm-4 col-xs-12">
                                            <div className="unitPrice">
                                                <span className="cls size_20"><b>Base Price :</b> {data.unitprice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 o-btn-in text-right col-sm-4 col-xs-12">
                                            <a className="orange_price_btn">{data.currencysymbol} {data.totalprice.toFixed(2)}</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-sm-12 col-xs-12 xsnoflush">
                                        <hr className="gr" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                {cartdeleteconfirm === true &&
                    <div id="cartdeleteconfirmmodel" className="modal address fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                        <button type="button" className="close" data-dismiss="modal">
                                            <img src="/images/close.svg" alt="" /></button>
                                        <h3>Delete item</h3>
                                    </div>
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                        <form className="customForm">
                                            <div className="col-lg-12 text-center col-sm-12 col-xs-12 flush">
                                                <p>Are you sure you want to delete this item?<br /> This may affect your item in cart. You might need to add items again.</p>
                                            </div>
                                            <div className="col-lg-12 margin_top_10 text-center col-sm-12 col-xs-12">
                                                <a
                                                    className="light_orange_btn margin_bottom_20 margin_right_10"
                                                    data-dismiss="modal"
                                                    data-toggle="modal"
                                                    onClick={handleClickDelete}
                                                >Confirm</a>
                                                <a className="light_orange_btn margin_bottom_20 margin_left_10" data-dismiss="modal">Cancel</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
}

export default ShoppingCartItem
