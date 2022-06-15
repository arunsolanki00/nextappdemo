import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MemoizedHeaderLogoComponent } from '../../../components/Header/headerlogo.component';
import handleNotify from '../../../components/helpers/toaster/toaster-notify';
import { ToasterPositions } from '../../../components/helpers/toaster/toaster-positions';
import { ToasterTypes } from '../../../components/helpers/toaster/toaster-types';
import { GetCurrency } from '../../../components/helpers/utility';
import { emptycart, updateCartItemCount } from '../../../redux/cart/cart.action';
import { CartTypes } from '../../../redux/cart/cart.types';
import { addCalculatedTotal, addCardShowMessage, emptyorder, isRedirectToCheckout, setorderId, setordertime } from '../../../redux/order/order.action';
import { OrderServices } from '../../../redux/order/order.services';

const Choosepayment = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const customerId = userinfo.customerId;
    const [optionSelected, setoptionSelected] = useState(false)
    const [showinvalidpopup, setshowinvalidpopup] = useState(false)
    const { restaurantURL } = restaurantinfo;
    const [cashselected, setcashselcted] = useState(false)
    const [cardclass, setcardclass] = useState('')
    const location = restaurantinfo.defaultLocation;
    const locationlink=router.query.location;
    const [deliveryaddressId, setDeliveryaddressId] = useState(0);
    const [cashclass, setcashclass] = useState('');
    const [isDisableOrder, setIsDisableOrder] = useState(false)
    const [ordertimeerrormessage, setordertimeerrormessage] = useState("");
    const [paymentType, setpaymentType] = useState();
    const [buttonName, setbuttonName] = useState("Place Order")
    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
    const ordertype = selecteddelivery.pickupordelivery === "Pickup" ? 1 : 2;
    let sessionid = useSelector(({ session }) => session?.sessionid);
    let cart = useSelector(({ cart }) => cart);
    const order = useSelector(({ order }) => order);
    let carttotal = cart?.carttotal && cart.carttotal;
    const [grandtotal, setgrandtotal] = useState(carttotal?.grandTotal != undefined ? parseFloat(carttotal.grandTotal) : 0);
    
    let promotionData = carttotal?.PromotionData && carttotal.PromotionData;

    let currencySymbol = GetCurrency();

    const handleCardPayment = () => {
        setpaymentType(2)
        setcardclass("active")
        setcashclass("white")
        setoptionSelected(true)
        setcashselcted(false)
        setshowinvalidpopup(false)
    }
    const handleCashPayment = () => {
        setpaymentType(1)
        setcardclass("white")
        setcashclass("active")
        setoptionSelected(true)
        setcashselcted(true)
        setshowinvalidpopup(false)
    }
    const handleClickPlaceOrder = () => {
        if (optionSelected === false) {
            setshowinvalidpopup(true)
            setIsDisableOrder(false);
            return;
        }
        else {
            setshowinvalidpopup(false)
        }
        addorders(order.isasap, paymentType);
        setbuttonName("Processing...")
        setIsDisableOrder(true)
    }

    const [currentDate, setcurrentDate] = useState();
    useEffect(() => {
        let date = new Date();
        setcurrentDate(date);
    }, []);
    useEffect(() => {
        if ((order && order.checktime && order.isasap === true) || (order.checktime === "")) {
            OrderServices.getOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((response) => {
                if (response.result != undefined && response.result !== null) {
                    if (response.result.ordertime != undefined && response.result.ordertime !== null && response.result.ordertime !== "") {
                        let ordertimeArray = response.result.ordertime && response.result.ordertime.split(":");
                        if (ordertimeArray.length > 0) {
                            setIsDisableOrder(false);
                            dispatch(setordertime(ordertimeArray[0] + ":" + ordertimeArray[1] + " " + ordertimeArray[2]));
                        }
                    }
                    else if (response.result.isAvailable === false) {
                        setordertimeerrormessage(response.result.message);
                        dispatch(setordertime(""));
                        setIsDisableOrder(true);
                    }
                }

            });
        }
    }, []);
    useEffect(()=>{
        if (selecteddelivery.selecteddeliveryaddress) {
            setDeliveryaddressId(selecteddelivery.selecteddeliveryaddress.deliveryaddressId)
        }
    },[])
  

    function refreshCart(orderId) {
        let rewardpoint = cart?.rewardpoints;
        dispatch(updateCartItemCount());
        OrderServices.getOrderInfo(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, orderId, customerId).then((response) => {
            if (response) {
                const result = response.result.orderDetailInfo;
                if (result != undefined && result.OrderDetailCal !== undefined) {
                    dispatch(addCalculatedTotal(result.OrderDetailCal?.calculatedTotal))
                    dispatch(addCardShowMessage(result.OrderDetailCal?.cardShowMessage))
                    dispatch({
                        type: CartTypes.EMPTY_CART_TOTAL,
                        payload: null
                    });
                    dispatch({
                        type: CartTypes.UPDATE_CART_DATA,
                        payload: null
                    });
                    if (userinfo) {
                        let rewardpoints = {
                            rewardvalue: rewardpoint?.rewardvalue,
                            rewardamount: rewardpoint?.rewardamount,
                            rewardPoint: rewardpoint?.rewardPoint,
                            totalRewardPoints: rewardpoint?.rewardPoint,
                            redeemPoint: rewardpoint?.redeemPoint,
                        };
                        dispatch({
                            type: CartTypes.SET_REWARD_POINT,
                            payload: rewardpoints,
                        });
                    }
                }
            }
        });
        return;
    }

    const addorders = (isAsap, paymentType) => {
        let placeOrder = {
            redeemPoints: cart.rewardpoints?.redeemPoint > 0 ? cart.rewardpoints.redeemPoint : 0,
            orderInstruction: cart.orderinstruction || cart.orderinstruction !== undefined ? cart.orderinstruction : "",
            preDiscountSubTotal: cart.carttotal?.subTotal > 0 ? parseFloat(cart.carttotal?.subTotal) : 0,
            tip: cart.carttotal.tipAmount > 0 ? parseFloat(cart.carttotal?.tipAmount) : 0,
            hstTax: cart.carttotal.hstTotal > 0 ? parseFloat(cart.carttotal.hstTotal) : 0,
            discountTotal: cart.carttotal.discountAmount > 0 ? parseFloat(cart.carttotal.discountAmount) : 0,
            deliveryCharges: cart.carttotal.deliveryAmount > 0 ? parseFloat(cart.carttotal.deliveryAmount) : 0,
            orderTotal: cart.carttotal.grandTotal > 0 ? parseFloat(cart.carttotal.grandTotal) : 0,
            ordertype: ordertype,
            cartsessionId: sessionid, //getSessionKey(restaurantinfo.restaurantId, userinfo.customerId),
            customerId: parseInt(customerId),
            addressId: deliveryaddressId,
            selectedTime: order && order.checktime && order.checktime !== "" ? order.checktime : "",
            isAsap: isAsap, //true  false
            paymentType: paymentType,  //1 for cash payment    2 for card payment
            locationId: restaurantinfo.defaultlocationId,
            restaurantId: restaurantinfo.restaurantId,
            promotionData:promotionData,
        };

        OrderServices.addOrder(placeOrder, restaurantinfo.restaurantId).then(response => {
            if (response.status === 1) {
                if (response.result.orderId && response.result.orderId > 0) {
                    dispatch(setorderId(response.result.orderId));
                    handleNotify('Order complete successfully! with OrderId: ' + response.result.orderId, ToasterPositions.TopRight, ToasterTypes.Success);
                    if (paymentType === 1) {
                        dispatch(emptycart());
                        dispatch(emptyorder());
                        router.push("/" + restaurantinfo.restaurantURL+"/"+locationlink + "/main");
                    }
                    if (paymentType === 2) {
                        dispatch(isRedirectToCheckout(true));
                        refreshCart(response.result.orderId);
                        router.push("/" + restaurantinfo.restaurantURL +"/"+locationlink +"/checkout");
                    }
                }
            } else if (response.status == 2) {
                handleNotify(response.message, ToasterPositions.TopRight, ToasterTypes.Error);
            }
        });
        return;
    }
    return (
        <section id="pickup" className="checkout">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
                    </div>
                    <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                        <Link href={`/${restaurantURL}/${locationlink}/cart`}>
                            <a className="size_24 weight_500 color_grey">
                                <span className="bg_grey">
                                    <img src="/images/arrow-left.svg" />
                                </span> Back
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                        <MemoizedHeaderLogoComponent />
                    </div>

                    <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                        {/* <MemoizedHeaderLogoComponent /> */}
                    </div>
                    <div className="col-lg-2 text-right  flush col-sm-4 col-xs-6">
                        <div className="col-lg-12 rt-total col-sm-12 col-xs-12" style={{ marginTop: 11 }}>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                            <h1 className="margin_bottom_30">Place order</h1>
                        </div>
                    </div>
                    {
                        location && location.isOrderingDisable == false &&
                        <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                        {location.IsPayByCard && 
                         <a className={cardclass} onClick={handleCardPayment}>
                         <span><i className="fa fa-credit-card"></i></span>
                         Pay by<br />Card
                     </a>} 
                          {location.IsPayByCash &&
                          <a className={cashclass} onClick={handleCashPayment}>
                              <span><i className="fa fa-credit-card"></i></span>
                              Pay by<br />Cash
                          </a>
                     }
                      </div>
                    }
                    {cashselected && <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12" >
                        <h5 className="size_22  weight_300 margin_bottom_20" >You will need to pay at the restaurant when you pickup your order. </h5>
                    </div>
                    }
                    {showinvalidpopup === true && <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12" >
                        <h5 className="size_22 color_red weight_300 margin_bottom_20" >Please select Payment mode first</h5>
                    </div>
                    }
                    <div className="col-lg-12 col-sm-12 col-xs-12" style={{ width: "320px", marginLeft: "416px", marginTop: "27px" }}>
                        <h3 className="margin_top_20 margin_bottom_20">
                            TOTAL{" "}
                            <span className="color_orange size_24 float_right weight_300">
                                {" "}{currencySymbol}
                                {grandtotal != undefined &&
                                    grandtotal &&
                                    + grandtotal.toFixed(2)}
                            </span>
                        </h3>
                    </div>
                    {
                        isDisableOrder ?
                            <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12 " >
                                <a className="blue_btn blue_btn_porder disabled" >{buttonName}</a>
                            </div>
                            : <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12"
                                data-dismiss="modal"
                                data-toggle="modal"
                                data-target="#cartdeleteconfirmmodel" onClick={handleClickPlaceOrder} >
                                <a className="blue_btn blue_btn_porder" >Place Order</a>
                            </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default Choosepayment;
