import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { restaurantsdetail,  restaurantstiming } from "../../redux/restaurants/restaurants.action";
import { getAddress } from "../../redux/delivery-address/delivery-address.action";
import RestaurantLocationsComponent from "../../components/Common/restaurant-locations.component";
import RestaurantTimmingComponent from "../../components/Common/restaurant-timming.component";
import SaveAddressPopup from "../../components/Common/Address/save-address.component";
import { MemoizedHeaderLogoComponent } from "../../components/Header/headerlogo.component";
import { OrderServices } from "../../redux/order/order.services";
import { emptyorder, emptyordertime, isasap, isRedirectToCheckout, setorderId, setordertime } from "../../redux/order/order.action";
import { emptycart,  updateCartItemCount } from "../../redux/cart/cart.action";
import handleNotify from "../../components/helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../components/helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../components/helpers/toaster/toaster-types";
import { RestaurantsServices } from "../../redux/restaurants/restaurants.services";
import { getLocationIdFromStorage } from "../../components/Common/localstore";
import ChooseTimeConfirm from "../../components/Common/choose-time-confirm.component";
import { CartTypes } from "../../redux/cart/cart.types";
import { MonthList } from "../../components/helpers/utility";
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from "../../components/helpers/static-message/pickupconfirmation2-message";
import { DeliveryPickupButton } from "../../components/Common/delivery-pickup-button.component";
import { selecteddeliveryaddress } from "../../redux/selected-delivery-data/selecteddelivery.action";
import LoginMainComponent from "../../components/login/login.component";
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
const DeliveryConfirmation = () => {
    let sessionid = useSelector(({ session }) => session?.sessionid);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const order = useSelector(({ order }) => order);
    const isAsapSelected = order.isasap;
    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
    const selecteddeliveryAddress = selecteddelivery && selecteddelivery.selecteddeliveryaddress;
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const [saveaddresspopup, setsaveaddresspopup] = useState(false);
    const location = restaurantinfo.defaultLocation;
    const isTakeOutAsap = location.isTakeOutAsap;
    const isTakeOutPickupTime = location.isTakeOutPickupTime;
    const [ordertimedisplay, setordertimedisplay] = useState(order.checktime);
    const [isDisableOrder, setIsDisableOrder] = useState(true)
    const [ordertimeerrormessage, setordertimeerrormessage] = useState("")
    const [timestate, settimestate] = useState(false);
    const [isdisable, setisdisable] = useState(false);
    const [paybyCash, setpaybyCash] = useState('')
    const [paybycard, setpaybycard] = useState('')
    const [isOrdering, setIsOrdering] = useState(false);
    const [displayASAPTime, setDisplayASAPTime] = useState(false);
    const [activeButtonClass, setActiveButtonClass] = useState("");
    const [isDisabled, setisDisabled] = useState(true)
    const [showLogin, setShowLogin] = useState(false)
    const [locationpopup, setlocationpopup] = useState(false);
    const [restaurantHoursPopup, setrestaurantHoursPopup] = useState(false);
    const [isPayActive, setisPayActive] = useState(false);
    const cart = useSelector(({ cart }) => cart);
    const ordertype = selecteddelivery.pickupordelivery === "Delivery" ? 2 : 1;
    const pickupordelivery = selecteddelivery.pickupordelivery === "Delivery" ? 2 : 1;
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const isDeliveryPickupTime = location.isDeliveryPickupTime;
    const isDeliveryAsap = location.isDeliveryAsap;
    const deliveryaddress = useSelector(({ deliveryaddress }) => deliveryaddress);
    let deliveryaddressdata = deliveryaddress?.deliveryaddressdata;
    const deliveryid = useSelector(({ deliveryaddress }) => deliveryaddress?.addressId.customerAddressId);
    const dispatch = useDispatch();
    const router = useRouter();
    const { query: { dynamic }, } = router;
    const paymenttype = {
        CASH: 1,
        CARD: 2
    }
    const [currentDate, setcurrentDate] = useState();
    useEffect(() => {
        let date = new Date();
        setcurrentDate(date);
    }, []);

    useEffect(() => {
        if (dynamic && dynamic !== undefined) {
            let restauranturl = dynamic.toLowerCase().toString().replace(/ /g, "-");
            let locationId = getLocationIdFromStorage();
            RestaurantsServices.getRestaurantsList(restauranturl, locationId).then(response => {
                if (response) {
                    let newselectedRestaurant = response[0];

                    if (newselectedRestaurant) {
                        dispatch(restaurantsdetail(newselectedRestaurant));
                    }
                    if (newselectedRestaurant.defaultLocation.isOrderingDisable === true)
                        router.push("/" + newselectedRestaurant.restaurantURL + "/restaurant-close");
                    else setIsOrdering(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        dispatch(restaurantstiming(restaurantinfo && restaurantinfo.defaultlocationId, restaurantinfo && restaurantinfo.restaurantId));
        dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
    }, [restaurantinfo, userinfo, deliveryid]);

    useEffect(() => {
        if ((order && order.checktime && order.isasap === true) || (order.checktime === "")) {
            OrderServices.getOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((response) => {
                if (response.result != undefined && response.result !== null) {
                    if (response.result.ordertime != undefined && response.result.ordertime !== null && response.result.ordertime !== "") {
                        let ordertimeArray = response.result.ordertime && response.result.ordertime.split(":");
                        if (ordertimeArray.length > 0) {
                            setordertimedisplay(ordertimeArray[0] + ":" + ordertimeArray[1] + " " + ordertimeArray[2]);
                            setIsDisableOrder(false);
                            dispatch(setordertime(ordertimeArray[0] + ":" + ordertimeArray[1] + " " + ordertimeArray[2]));
                        }
                    }
                    else if (response.result.isAvailable === false) {
                        setActiveButtonClass("");
                        setordertimeerrormessage(response.result.message);
                        dispatch(setordertime(""));
                        setIsDisableOrder(true);
                    }
                }
            });
        }
        if (order?.isasap === true) {
            setActiveButtonClass("asap");
        }
    }, []);

    useEffect(() => {
        if (order && order.checktime && order.isasap === false) {
            setActiveButtonClass('lateron')
            if (order.checktime.includes('AM') || order.checktime.includes('PM')) {
                let otime = order.checktime.split(' ');
                OrderServices.checkOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, otime[0], otime[1], ordertype)
                    .then((response) => {
                        if (response.result != undefined && response.result !== null) {
                            if (response.result.status === 'fail' || response.result.status === 'error') {
                                setordertimeerrormessage(response.result.message);
                                dispatch(setordertime(""));
                                setIsDisableOrder(true);
                                setActiveButtonClass("");
                            }
                            if (response.result.status === 'success') {
                                setIsDisableOrder(false);
                            }
                        }
                    });
            }
        }
    }, [order?.checktime]);
    if (selecteddeliveryAddress === null && deliveryaddressdata !== null) {
        dispatch(selecteddeliveryaddress(deliveryaddressdata[0]))
    }
    const handleLocationPopup = () => setlocationpopup(true);
    const handlerestaurantHoursPopup = () => setrestaurantHoursPopup(true);
    const handlePaymentActive = () => {
        if (userinfo === null) {
            setShowLogin(true)
        } else {
            setShowLogin(false)
        }
        if (selecteddeliveryAddress === null ) {
            setsaveaddresspopup(true);

        }
        else {
            setsaveaddresspopup(false);
            if(userinfo !== null){
                router.push("/" + restaurantinfo.restaurantURL + "/cart");
            }
        }
    }

    const handlechangePopup = () => {
        dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
        setsaveaddresspopup(true);
    }

    const handleCardPayment = () => {
        setpaybycard("Processing...");
        setpaybyCash("Pay By Cash");
        setisdisable(true);
        addorders(order.isasap, paymenttype.CARD);
    }
    const handleCashPayment = () => {
        addorders(order.isasap, paymenttype.CASH);
        setpaybycard("Pay By Card");
        setpaybyCash("Processing...");
        addorders(order.isasap, paymenttype.CASH);
        setisdisable(true)
    }

    const handleChooseTime = () => { settimestate(true) }
    //call from child to parent for set selected time
    function checktimeselected(selecetdtime, errorMessage) {
        if (selecetdtime !== "") {
            setordertimedisplay(selecetdtime);
            dispatch(setordertime(selecetdtime))
            setIsDisableOrder(false);
            setActiveButtonClass('lateron');
            dispatch(isasap(false));
        }
        if (errorMessage !== "") {
            setordertimeerrormessage(errorMessage);
            setIsDisableOrder(true);
            dispatch(setordertime(""))
            setisPayActive(false);
        } else {
            setordertimeerrormessage("");
        }
    }
    function refreshCart(orderId) {
        let rewardpoint = cart.rewardpoints;
        dispatch(updateCartItemCount());
        OrderServices.getOrderInfo(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, orderId, userinfo.customerId).then((response) => {
            if (response) {
                const result = response.result.orderDetailInfo;
                if (result != undefined && result.OrderDetailCal !== undefined) {
                    dispatch({
                        type: CartTypes.EMPTY_CART_TOTAL,
                        payload: null
                    });
                    dispatch({
                        type: CartTypes.UPDATE_CART_DATA,
                        payload: null
                    });

                    dispatch({
                        type: CartTypes.SET_ORDER_INFO,
                        payload: result.OrderDetailCal
                    });


                    if (userinfo) {

                        let rewardpoints = {
                            rewardvalue: rewardpoint.rewardvalue,
                            rewardamount: rewardpoint.rewardamount,
                            rewardPoint: rewardpoint.rewardPoint,
                            totalRewardPoints: rewardpoint.rewardPoint,
                            redeemPoint: rewardpoint.redeemPoint,
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
            redeemPoints: cart.rewardpoints.redeemPoint > 0 ? cart.rewardpoints.redeemPoint : 0,
            orderInstruction: cart.orderinstruction || cart.orderinstruction !== undefined ? cart.orderinstruction : "",
            preDiscountSubTotal: cart.carttotal.subTotal > 0 ? parseFloat(cart.carttotal.subTotal) : 0,
            tip: cart.carttotal.tipAmount > 0 ? parseFloat(cart.carttotal.tipAmount) : 0,
            hstTax: cart.carttotal.hstTotal > 0 ? parseFloat(cart.carttotal.hstTotal) : 0,
            discountTotal: cart.carttotal.discountAmount > 0 ? parseFloat(cart.carttotal.discountAmount) : 0,
            deliveryCharges: cart.carttotal.deliveryAmount > 0 ? parseFloat(cart.carttotal.deliveryAmount) : 0,
            orderTotal: cart.carttotal.grandTotal > 0 ? parseFloat(cart.carttotal.grandTotal) : 0,
            ordertype: ordertype,
            cartsessionId: sessionid,
            customerId: parseInt(userinfo.customerId),
            addressId: selecteddeliveryAddress && selecteddeliveryAddress.deliveryaddressId ? selecteddeliveryAddress.deliveryaddressId : 0,
            selectedTime: order && order.checktime && order.checktime !== "" ? order.checktime : "",
            isAsap: isAsap, //true  false
            paymentType: paymentType,  //1 for cash payment    2 for card payment
            locationId: restaurantinfo.defaultlocationId,
            restaurantId: restaurantinfo.restaurantId,
        };

        OrderServices.addOrder(placeOrder, restaurantinfo.restaurantId).then(response => {

            console.log("response " + response)
            if (response.status === 1) {
                if (response.result.orderId && response.result.orderId > 0) {
                    dispatch(setorderId(response.result.orderId));
                    handleNotify('Order complete successfully! with OrderId: ' + response.result.orderId, ToasterPositions.TopRight, ToasterTypes.Success);

                    if (paymentType === paymenttype.CASH) {
                        dispatch(emptycart());
                        dispatch(emptyorder());
                        router.push("/" + restaurantinfo.restaurantURL + "/main");
                    }
                    if (paymentType === paymenttype.CARD) {
                        dispatch(isRedirectToCheckout(true));

                        refreshCart(response.result.orderId);
                        router.push("/" + restaurantinfo.restaurantURL + "/checkout");
                    }
                }
            } else if (response.status == 2) {
                handleNotify(response.message, ToasterPositions.TopRight, ToasterTypes.Error);
                setisdisable(false);
            }
        });

    }


    const handletimeclick = (timeselect) => {
        setordertimeerrormessage("");
        setDisplayASAPTime(!displayASAPTime);
        setActiveButtonClass('asap');
        OrderServices.getOrderTiming(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((gettimeresponse) => {
            if (gettimeresponse?.result) {
                if (gettimeresponse.result?.time) {
                    let time = gettimeresponse.result.time.split(' ');
                    OrderServices.checkOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, time[0], time[1], ordertype)
                        .then((response) => {
                            if (response.result.message && response.result.message.length > 0 && response.result.status !== "success") {
                                setordertimeerrormessage(response.result.message);
                                settimestate(false);
                                setDisplayASAPTime(false);
                                dispatch(emptyordertime());
                                setisDisabled(true)
                                return;
                            }
                            if (response.result != undefined && response.result !== null) {
                                if (response.result?.status === "success") {
                                    let newtime = time[0] + ' ' + time[1];
                                    setordertimedisplay(newtime);
                                    dispatch(setordertime(newtime));
                                    setisDisabled(false);
                                    setIsDisableOrder(false);
                                    setActiveButtonClass('asap');
                                } else {
                                    setordertimeerrormessage(response.result.message);
                                    setDisplayASAPTime(false);
                                    setisDisabled(true)
                                    setActiveButtonClass("");
                                }
                                setDisplayASAPTime(!displayASAPTime);
                                dispatch(isasap(true));
                            }
                        });
                }
            }
        });
    }

    return (
        <>
            {isOrdering &&
                <section id="pickup" className="checkout">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
                                <a><img src="/images/logo-blue.png" alt="" /></a>
                            </div>
                            <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                                <Link href="/[dynamic]/cart" as={`/${restaurantinfo.restaurantURL}/cart`}>
                                    <a className="size_24 weight_500 color_grey">
                                        <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span> Back
                                    </a>
                                </Link>
                            </div>
                            <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                                <MemoizedHeaderLogoComponent />
                            </div>
                            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                    <h1 className="margin_bottom_30">Delivery Confirmation</h1>
                                </div>
                            </div>
                            <DeliveryPickupButton page="deliveryconfirmation" />
                        </div>
                        <div className="row">
                            <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                <div className="col-lg-10 column-centered col-sm-12 col-xs-12">
                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">1</div>
                                            <div className="line"></div>
                                        </div>
                                        <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3>Restaurant Info</h3>
                                                </div>
                                            </div>
                                            <div className="row in">
                                                <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                                    <div className="col-lg-6 col-sm-6 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                            <img src="/images/pin.png" alt="" />
                                                            {restaurantinfo && restaurantinfo.defaultLocation.locationName}<br />
                                                            <span className="size_20 color_grey">
                                                                {`${restaurantinfo && restaurantinfo.defaultLocation.address1},  ${restaurantinfo && restaurantinfo.defaultLocation.cityname}`}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-lg-6 text-left col-sm-6 col-xs-12">
                                                    </div>
                                                </div>
                                                {defaultLocation.istakeaway && defaultLocation.isOrderingDisable === false && pickupWindow && pickupWindow.length > 0 ?
                                                        <div className="col-lg-4 col-sm-4 col-xs-12">
                                                            {(isTakeOutPickupTime === true || isTakeOutAsap === true) &&
                                                                <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{PickUpConfirmationMessage.PICKUP_WINDOWS}<br /><span className="size_20 color_grey">
                                                                    {pickupWindow && pickupWindow.map((time, index) => {
                                                                        return (<div key={Math.random()}> {time}
                                                                            <br /></div>)
                                                                    })}
                                                                </span> </h5>
                                                            }
                                                        </div>
                                                        : <> <div className="col-lg-4 col-sm-4 col-xs-12">
                                                            <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                                {defaultLocation.istakeaway && (<> <i className="fa fa-clock-o"></i>{PickUpConfirmationMessage.PICKUP_WINDOWS}<br /><span className="size_20 color_red">
                                                                    {PickUpConfirmationMessage.PICKUP_CLOSE_TODAY}
                                                                </span>
                                                                </>
                                                                )}
                                                            </h5>
                                                        </div>  </>}
                                                    {defaultLocation.isdelivery && deliveryWindow && deliveryWindow.length > 0 && defaultLocation.isOrderingDisable === false ?
                                                        <div className="col-lg-4 col-sm-4 col-xs-12">
                                                            {(isDeliveryAsap === true || isDeliveryPickupTime === true) &&

                                                                <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br /><span className="size_20 color_grey">
                                                                    {deliveryWindow && deliveryWindow.map((data, index) => {
                                                                        return (<div key={index}>{data}
                                                                            <br /></div>)
                                                                    })}
                                                                </span> </h5>
                                                            }
                                                        </div>
                                                        : <><div className="col-lg-4 col-sm-4 col-xs-12">
                                                            <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                                {defaultLocation.isdelivery && (<> <i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br />
                                                                    <span className="size_20 color_red">
                                                                        {PickUpConfirmationMessage.DELIVERY_CLOSE_TODAY}
                                                                    </span>
                                                                </>)}
                                                            </h5>
                                                        </div> </>}
                                                        {defaultLocation.istakeaway || defaultLocation.isdelivery ?
                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                            <a className="light_orange_btn clock_more_btn"
                                                                onClick={handlerestaurantHoursPopup}
                                                                data-toggle="modal"
                                                                data-target="#myModal-2"
                                                            ><i className="fa fa-clock-o"></i> More</a>
                                                        </div>
                                                        : ('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">2</div>
                                            <div className="line"></div>
                                        </div>
                                        <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3>Delivery Address</h3>
                                                </div>
                                            </div>
                                            <div className="row in">
                                                <div className="col-lg-12 flush col-sm-12 col-xs-12">

                                                    <div className="col-lg-8 col-sm-8 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pin.png" alt="" />
                                                            {selecteddeliveryAddress && selecteddeliveryAddress.addresstype === 0 &&
                                                                <span className="size_20 color_grey margin_top_0">{selecteddeliveryAddress.address1},<br />{selecteddeliveryAddress.city} <br />{selecteddeliveryAddress.landmark}, {selecteddeliveryAddress.zipcode}</span>
                                                            }
                                                            {selecteddeliveryAddress && selecteddeliveryAddress.addresstype === 1 &&
                                                                <span className="size_20 color_grey margin_top_0">{selecteddeliveryAddress.businessname},<br />{selecteddeliveryAddress.address1} <br />{selecteddeliveryAddress.landmark}, {selecteddeliveryAddress.zipcode}</span>
                                                            }
                                                        </h5>
                                                    </div>
                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                        <a
                                                            className="light_orange_btn  padding_left_20 padding_right_20 clock_more_btn"
                                                            data-dismiss="modal"
                                                            data-toggle="modal"
                                                            data-target="#mysaveModal"
                                                            onClick={handlechangePopup}
                                                        ><i className="fa fa-map-marker"></i>Change</a>
                                                        <p className="size_12 margin_top_10">Changing location may affect your <br />added items in cart.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">3</div>
                                        </div>
                                        <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3>Select Delivery Time</h3>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-8 column-centered flush margin_top_10 col-sm-10 col-xs-12">
                                                    <br />
                                                    <div className="col-lg-1"> </div>
                                                    <div className="col-lg-5 text-center col-sm-4 col-xs-12">
                                                        {isTakeOutAsap === true &&
                                                            <a className={`light_orange_btn ${activeButtonClass == 'asap' ? 'active' : ''}`} onClick={handletimeclick} >ASAP</a>
                                                        }
                                                    </div>
                                                    <div className="col-lg-5 text-center col-sm-4 col-xs-12">
                                                        {isTakeOutPickupTime === true &&
                                                            <a className={`light_orange_btn ${activeButtonClass == 'lateron' ? 'active' : ''}`}
                                                                onClick={handleChooseTime}
                                                                data-toggle="modal"
                                                                data-target="#myModal-timer">Later On</a>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 dd margin_top_10 col-sm-3 col-xs-12"></div>
                                                {(ordertimedisplay || ordertimeerrormessage) &&
                                                    <>
                                                        {(ordertimedisplay && ordertimeerrormessage === "") ?
                                                            <div className="col-lg-6 dd margin_top_10 col-sm-6 col-xs-12">
                                                                {
                                                                    (isAsapSelected === true || isAsapSelected === false) &&
                                                                    <h5 className="removembottom color_black">
                                                                        Today {ordertimedisplay && <> {MonthList(currentDate.getMonth())} {currentDate.getDate()}, {ordertimedisplay} </>}
                                                                    </h5>
                                                                }
                                                            </div>
                                                            : <>
                                                                {ordertimeerrormessage !== "" &&
                                                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                                                        <h5 className="size_24 color_red  text-center weight_500 margin_top_0 margin_bottom_15">{ordertimeerrormessage}</h5>
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>

                                            <div className="row">
                                                {
                                                    isDisableOrder === false && isdisable === false && ordertimedisplay !== "" && isAsapSelected ===false|| isAsapSelected===true ?

                                                        <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12" onClick={handlePaymentActive} >
                                                            {
                                                                userinfo === null ? <a className="blue_btn blue_btn_porder"
                                                                    id="popupsave"
                                                                    data-toggle="modal"
                                                                    data-target="#myModal-logintest"
                                                                >Looks Good</a> :
                                                                    <a className="blue_btn blue_btn_porder"
                                                                        id="popupsave"
                                                                        data-dismiss="modal"
                                                                        data-toggle="modal"
                                                                        data-target="#mysaveModal"
                                                                    >Looks Good</a>
                                                            }
                                                        </div>
                                                        :
                                                        <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12 " >
                                                            <a className="blue_btn blue_btn_porder disabled" >Looks Good</a>
                                                        </div>
                                                }
                                            </div>
                                            {
                                                isPayActive &&
                                                <div className="row" >
                                                    <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                                                        {location && location.isOrderingDisable == false &&
                                                            <>
                                                                <div className="col-lg-12 col-sm-12 col-xs-12"><h4 className="size_24 color_orange weight_500 margin_top_0 margin_bottom_30">Payment Type</h4></div>
                                                                {
                                                                    isdisable ?
                                                                        <>
                                                                            {location.IsPayByCash === true && <> <a className="orange_side_btn orange_bord_btn customdisable">{paybyCash}</a> </>}
                                                                            {location.IsPayByCard === true && <> <a className="orange_side_btn orange_bord_btn customdisable">{paybycard}</a> </>}
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {location.IsPayByCash === true && <> <a className="orange_side_btn orange_bord_btn" onClick={handleCashPayment}>Pay By Cash</a> </>}
                                                                            {location.IsPayByCard === true && <> <a className="orange_side_btn orange_bord_btn" onClick={handleCardPayment}>Pay By Card</a> </>}
                                                                        </>
                                                                }
                                                            </>
                                                        }

                                                        {location && location.isOrderingDisable == true &&
                                                            <>
                                                                <h5 className="size_22 color_black weight_300 margin_bottom_20"> {location.orderingMessage && location.orderingMessage} </h5>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {locationpopup === true && (
                <RestaurantLocationsComponent restaurantId={restaurantinfo && restaurantinfo.defaultLocation.restaurantId} />
            )}

            {restaurantHoursPopup === true && (
                <RestaurantTimmingComponent
                    locationId={restaurantinfo && restaurantinfo.defaultlocationId}
                    restaurantId={restaurantinfo && restaurantinfo.defaultLocation.restaurantId}
                />
            )}
            {saveaddresspopup === true && <SaveAddressPopup />}
            {timestate === true && <ChooseTimeConfirm ordertype={ordertype} restaurantinfo={restaurantinfo} restaurantWindowTime={restaurantWindowTime} ordertime={ordertimedisplay} isTakeAway={location.istakeaway} isDelivery={location.isdelivery} checktimeselected={checktimeselected} />}
            {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo}   />}
        </>
    )
}

export default DeliveryConfirmation;