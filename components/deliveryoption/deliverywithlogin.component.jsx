import React, {  useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { addAddress, DeleteTempDeliveryAddress, getAddress } from "../../redux/delivery-address/delivery-address.action";
import RestaurantTimmingComponent from "../Common/restaurant-timming.component";
import {  restaurantstiming } from "../../redux/restaurants/restaurants.action";
import AddAddress from "../Common/Address/add-address.component";
import Choosetime from "../Common/choose-time.component";
import LoginMainComponent from "../login/login.component";
import { selecteddeliveryaddress, setpickupordelivery } from "../../redux/selected-delivery-data/selecteddelivery.action";
import { OrderServices } from "../../redux/order/order.services";
import { emptyordertime, isasap, setordertime } from "../../redux/order/order.action";
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from "../../components/helpers/static-message/pickupconfirmation2-message";
import { getSelectedRestaurantTime } from "../../redux/main/main.action";
import Loader from "../Common/loader/loader.component";
import { Custombutton } from "../Common/button/custombutton";
import DeliveryDropdownComponent from "../Header/delivery-dropdown.component";
import { MemoizedMenuItemHeaderLogoComponent } from "../Header/menuitemheaderlogo.component";
import { MonthList } from "../helpers/utility";
import { DeliveryAddressTypes } from "../../redux/delivery-address/delivery-address.types";
import { v4 as uuidv4 } from 'uuid';
import { createSessionId } from "../../redux/session/session.action";

const Deliverywithlogin = () => {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const deliverydata = useSelector(({ deliveryaddress }) => deliveryaddress.deliveryaddressdata);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery.selecteddeliveryaddress);
    const addressId = useSelector(({ deliveryaddress }) => deliveryaddress?.addressId?.customerAddressId);
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);
    const dispatch = useDispatch();
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const [timestate, settimestate] = useState(false);
    const [ismore, setismore] = useState(false);
    const [restaurantHoursPopup, setrestaurantHoursPopup] = useState(false);
    const [addadresspopup, setaddadresspopup] = useState(false);
    const [displayASAPTime, setDisplayASAPTime] = useState(false);
    const [activeButtonClass, setActiveButtonClass] = useState("");
    const [orderTime, setOrderTime] = useState();
    const [timeOrErrorMessage, setTimeOrErrorMessage] = useState("");
    const [loadDeliveryComplete, setLoadDeliveryComplete] = useState(false);
    const [apiResponse, setapiResponse] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [redColorStyle, setredColorStyle] = useState({ color: "red" });
    const [isDisabled, setisDisabled] = useState(false)
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const tempDeliveryAddress = useSelector(({ deliveryaddress }) => deliveryaddress?.tempDeliveryAddress);
    const isTakeOutAsap = defaultLocation.isTakeOutAsap;
    const isTakeOutPickupTime = defaultLocation.isTakeOutPickupTime;
    const isDeliveryPickupTime = defaultLocation.isDeliveryPickupTime;
    const isDeliveryAsap = defaultLocation.isDeliveryAsap;
    const [loadComplete, setLoadComplete] = useState(false);
    const [selectedAddressId, setselectedAddressId] = useState(addressId);
    const [currentDate, setcurrentDate] = useState();

    useEffect(() => {
        let date = new Date();
        setcurrentDate(date);
        if (tempDeliveryAddress && userinfo!== null && userinfo?.customerId>0 ) {
            var obj = {};
            obj.customerId = userinfo.customerId;
            obj.othercustomerId = 0;
            obj.deliveryaddressId = 0;
            obj.address1 = tempDeliveryAddress.address1 != undefined ? tempDeliveryAddress.address1 : '';
            obj.address2 = tempDeliveryAddress?.address2 != undefined ? tempDeliveryAddress?.address2 : '';
            obj.landmark = tempDeliveryAddress?.apartment != undefined ? tempDeliveryAddress?.apartment : '';
            obj.city = tempDeliveryAddress?.city != undefined ? tempDeliveryAddress?.city : '';
            obj.zipcode = tempDeliveryAddress?.zipcode != undefined ? tempDeliveryAddress?.zipcode : '';
            obj.contactno = "";
            obj.contactname = "";
            obj.latitude = tempDeliveryAddress?.latitude;
            obj.longitude = tempDeliveryAddress?.longitude;
            obj.state = tempDeliveryAddress?.state != undefined ? tempDeliveryAddress?.state : '';
            obj.country = tempDeliveryAddress?.country != undefined ? tempDeliveryAddress?.country : '';
            obj.addresstype = 0;
            obj.businessname = '';
            dispatch(addAddress(obj, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
            dispatch(selecteddeliveryaddress)
            dispatch(DeleteTempDeliveryAddress());
            setLoadComplete(!loadComplete);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setpickupordelivery('Delivery'));
            dispatch(restaurantstiming(restaurantinfo && restaurantinfo.defaultlocationId, restaurantinfo && restaurantinfo.defaultLocation.restaurantId));
            dispatch(getSelectedRestaurantTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
            setLoadDeliveryComplete(true);
            setOrderTime("")
            setTimeOrErrorMessage("")
            setActiveButtonClass("")
        };
        fetchData();
    }, [restaurantinfo?.defaultlocationId])

    useEffect(() => {
        if (restaurantinfo && userinfo) {
            dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
        }
    }, [loadComplete && userinfo !== null && userinfo.customerId>0]);
    //delivery type order
    var ordertype = 2;

    const handlelateronclick = () => {
        var guid=uuidv4();
        dispatch(createSessionId(guid));
        setTimeOrErrorMessage("");
        setActiveButtonClass('lateron');
        settimestate(true);
        dispatch(isasap(false));
    }

    const handletimeclick = () => {
        setTimeOrErrorMessage("");
        setDisplayASAPTime(!displayASAPTime);
        setActiveButtonClass('asap');
        OrderServices.getOrderTiming(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((gettimeresponse) => {
            console.log("get time response",gettimeresponse);
            if (gettimeresponse) {
                if (gettimeresponse?.result) {
                    if (gettimeresponse.result?.time) {
                        let time = gettimeresponse.result.time.split(' ');
                        OrderServices.checkOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, time[0], time[1], ordertype)
                            .then((response) => {
                                if (response.result.message && response.result.message.length > 0 && response.result.status !== "success") {
                                    setTimeOrErrorMessage(response.result.message);
                                    settimestate(false);
                                    setDisplayASAPTime(false);
                                    dispatch(emptyordertime());
                                    setisDisabled(true);
                                    return;
                                }
                                if (response.result != undefined && response.result !== null) {
                                    if (response.result.status === "success") {
                                        let newtime = time[0] + ' ' + time[1];
                                        setOrderTime(newtime);
                                        setisDisabled(false);
                                        dispatch(setordertime(newtime));
                                    } else {
                                        setTimeOrErrorMessage(response.result?.message);
                                        setDisplayASAPTime(false);
                                        setisDisabled(true);
                                    }
                                }
                            });
                        dispatch(isasap(true));
                    }
                }
            }
        });
    }

    const handleaddAddressPopup = () => setaddadresspopup(true);
    const handlerestaurantHoursPopup = () => setrestaurantHoursPopup(true);
    const handlemoreclick = (item) => setismore(!item);
    const logindetailsclick = () => setShowLogin(true);
    const handleaddressclick = (item) => {
        if (item != undefined) {
            dispatch(selecteddeliveryaddress(item));

            let addressId = { customerAddressId: item.deliveryaddressId };

            dispatch({
                type: DeliveryAddressTypes.UPDATE_ADDRESS_ID,
                payload: addressId
            });
        }
    }

    //call from child to parent for set selected time
    function checktimeselected(selecetdtime, errorMessage) {
        if (selecetdtime !== "") {
            setOrderTime(selecetdtime);
            setDisplayASAPTime(true);
            dispatch(setordertime(selecetdtime));
        }
        if (errorMessage !== "") {
            setOrderTime("");
            setTimeOrErrorMessage(errorMessage);
        }
    }

    function reloadAddressList() {
        dispatch(selecteddeliveryaddress(null))
        setLoadComplete(!loadComplete);
        setaddadresspopup(false);
    }

    if (loadDeliveryComplete) {
        return (
            <>
                <section id="pickup" className="checkout">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
                                <a href="index.html"><img src="/images/logo-blue.png" alt="" /></a>
                            </div>
                            <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                                <div className="col-lg-4 left-a col-sm-12 col-xs-12">
                                </div>
                                <MemoizedMenuItemHeaderLogoComponent />
                                <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                                    <DeliveryDropdownComponent />
                                </div>
                            </div>
                            <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                    <h1 className="margin_bottom_30">{DeliveryConfirmationMessage.DELIVERY}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                                {
                                    (isTakeOutAsap || isTakeOutPickupTime) &&
                                    <>
                                        {defaultLocation.istakeaway === true && pickupWindow && pickupWindow.length > 0 ?
                                            <Link href="/[dynamic]/pickup" as={`/${restaurantinfo.restaurantURL}/pickup`}>
                                                <a className="" >
                                                    <span>
                                                        <img className="white" src="/images/icon-1-white.svg" alt="" />
                                                        <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                                </a>
                                            </Link>
                                            :
                                            <a className="" style={{ backgroundColor: "lightgrey" }}>
                                                <span>
                                                    <img className="white" src="/images/icon-1-orange.svg" alt="" />
                                                    <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                            </a>
                                        }
                                    </>
                                }
                                <a className="active">
                                    <span>
                                        <img className="white" src="/images/icon-2-white.svg" alt="" />
                                        <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                </a>
                            </div>
                            {/* <DeliveryPickupButton page="delivery"/> */}
                            <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
                                <div className="col-lg-11 column-centered col-sm-12 col-xs-12">
                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">1</div>
                                            <div className="line"></div>
                                        </div>
                                        <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3>{DeliveryConfirmationMessage.SELECT_DELIVERY_ADRESS}</h3>
                                                </div>
                                            </div>
                                            <div className="row in">
                                                <div className="col-lg-12 col-sm-12 col-xs-12">
                                                    <div className="col-lg-4 flush">
                                                        {deliverydata != undefined && deliverydata != null && deliverydata && deliverydata.length > 0 && deliverydata.filter(x => x.addresstype === 0).length > 0 &&
                                                            <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">Personal Address</h4>
                                                        }
                                                    </div>
                                                    <div className="col-lg-4">
                                                        {deliverydata != undefined && deliverydata != null && deliverydata && deliverydata.length > 0 && deliverydata.filter(x => x.addresstype === 1).length > 0 &&

                                                            <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">Business Address</h4>
                                                        }
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <h4 className="size_24 color_orange weight_500 margin_top_10 margin_bottom_15">&nbsp;</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row in">
                                                <div className="col-lg-4 col-sm-4 col-xs-12">
                                                    {deliverydata != undefined && deliverydata != null && deliverydata && deliverydata.length > 0 && deliverydata.filter(x => x.addresstype === 0).length > 0 &&
                                                        deliverydata.filter(x => x.addresstype === 0).map((item, index) => {
                                                            let classname = "col-lg-12 col-sm-12 col-xs-12 padding_10 margin_top_6 border_radius_20";
                                                            if (addressId === item.deliveryaddressId) {
                                                                handleaddressclick(item);
                                                                classname += " bg_grey full_grey_border_selected";
                                                            }
                                                            else if (!addressId && selecteddelivery && item.deliveryaddressId === selecteddelivery.deliveryaddressId)
                                                                classname += " bg_grey full_grey_border_selected";
                                                            else
                                                                classname += " full_grey_border";

                                                            return (
                                                                <div onClick={() => handleaddressclick(item)} style={index === 0 || index === 1 ? { display: "block", cursor: "pointer" } : (index !== 0 && index !== 1 && ismore === true ? { display: "block", cursor: "pointer" } : { display: "none", cursor: "pointer" })} key={index}>
                                                                    <div className={classname}>

                                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">                                                                             <img src="/images/pin.png" alt="" />
                                                                            <span className="size_20 margin_top_0 color_grey">
                                                                                <>{item.address1.length > 0 && <>{item.address1.replace(/,\s*$/, "")} </>}
                                                                                    {item.address2.length > 0 && <> <br /> {item.address2.replace(/,\s*$/, "")}  </>}
                                                                                    {item.landmark.length > 0 && <><br /> {item.landmark.replace(/,\s*$/, "")} </>}
                                                                                    {item.city.length > 0 && <><br /> {item.city.replace(/,\s*$/, "")} </>}
                                                                                    {item.zipcode.length > 0 && <><br /> {item.zipcode.replace(/,\s*$/, "")} </>}
                                                                                </>
                                                                            </span>
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                </div>
                                                <div className="col-lg-4 col-sm-4 col-xs-12">
                                                    {deliverydata != undefined && deliverydata != null && deliverydata && deliverydata.length > 0 && deliverydata.filter(x => x.addresstype === 1).length > 0 &&
                                                        deliverydata.filter(x => x.addresstype === 1).map((item, index) => {
                                                            let classname = "col-lg-12 col-sm-12 col-xs-12 padding_10 margin_top_6 border_radius_20 ";
                                                            if (addressId === item.deliveryaddressId) {
                                                                handleaddressclick(item);
                                                                classname += " bg_grey full_grey_border_selected";
                                                            }
                                                            else if (!addressId && selecteddelivery && item.deliveryaddressId === selecteddelivery.deliveryaddressId)
                                                                classname += " bg_grey full_grey_border_selected";
                                                            else
                                                                classname += " full_grey_border";
                                                            return (
                                                                <div onClick={() => handleaddressclick(item)} style={index === 0 || index === 1 ? { display: "block", cursor: "pointer" } : (index !== 0 && index !== 1 && ismore === true ? { display: "block", cursor: "pointer" } : { display: "none", cursor: "pointer" })} key={index}>
                                                                    <div className={classname} >
                                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                                            <img src="/images/pin.png" alt="" />
                                                                            <span className="size_20 margin_top_0 color_grey">
                                                                                <>{item.businessname.length > 0 && <>{item.businessname.replace(/,\s*$/, "")}</>}
                                                                                    {item.address1.length > 0 && <><br />{item.address1.replace(/,\s*$/, "")}</>}
                                                                                    {item.address2.length > 0 && <><br /> {item.address2.replace(/,\s*$/, "")}  </>}
                                                                                    {item.landmark.length > 0 && <><br /> {item.landmark.replace(/,\s*$/, "")} </>}
                                                                                    {item.city.length > 0 && <><br /> {item.city.replace(/,\s*$/, "")} </>}
                                                                                    {item.zipcode.length > 0 && <><br /> {item.zipcode.replace(/,\s*$/, "")} </>}
                                                                                </>
                                                                            </span>
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                </div>
                                                <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                    <a
                                                        className="light_orange_btn clock_more_btn w-auto"
                                                        data-dismiss="modal"
                                                        data-toggle="modal"
                                                        data-target="#myModaladdress"
                                                        onClick={handleaddAddressPopup}
                                                    ><i className="fa fa-map-marker"></i> Add Address</a>
                                                </div>
                                            </div>
                                            {deliverydata && deliverydata.length > 2
                                                ?
                                                <div className="row in">
                                                    {ismore === false &&
                                                        <div className="col-lg-8 text-right">
                                                            <a onClick={() => handlemoreclick(ismore)} className="expandMoreAddress color_orange">More Addresses</a>
                                                        </div>}
                                                    {ismore === true &&
                                                        <div className="col-lg-8 text-right">
                                                            <a onClick={() => handlemoreclick(ismore)} className="shrinkAddress color_orange">Less Addresses</a>
                                                        </div>}
                                                </div>
                                                : ('')
                                            }
                                            <div className="row in margin_top_30">
                                                {defaultLocation.istakeaway && pickupWindow && pickupWindow.length > 0 ?
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        {(isTakeOutAsap === true || isTakeOutPickupTime === true) &&
                                                            <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                                <i className="fa fa-clock-o"></i>
                                                                {PickUpConfirmationMessage.PICKUP_WINDOWS}<br />

                                                                <span className="size_20 color_grey">
                                                                    {pickupWindow && pickupWindow.map((time, index) => {
                                                                        return (<div key={Math.random()}> {time}
                                                                            <br /></div>)
                                                                    })}
                                                                </span>
                                                            </h5>
                                                        }
                                                    </div>
                                                    : defaultLocation.istakeaway && (<><div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">

                                                            <i className="fa fa-clock-o"></i>{PickUpConfirmationMessage.PICKUP_WINDOWS}<br />
                                                            <a data-toggle="modal" data-target="#myModal-2">
                                                                <span className="size_20 color_red">
                                                                    {DeliveryConfirmationMessage.PICKUP_CLOSE_TODAY}
                                                                </span>
                                                            </a>

                                                        </h5>
                                                    </div>
                                                    </>)}

                                                {defaultLocation.isdelivery && deliveryWindow && deliveryWindow.length > 0 ?
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        {(isDeliveryAsap === true || isDeliveryPickupTime === true) &&
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                        <i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br />
                                                        <span className="size_20 color_grey">
                                                            {deliveryWindow && deliveryWindow.map((data, index) => {
                                                                return (<div key={index}>{data}
                                                                    <br  /></div>)
                                                            })}
                                                        </span>
                                                    </h5>
                                                        }
                                                        
                                                    </div>
                                                    : <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                            {defaultLocation.isdelivery && (<>
                                                                <i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br />
                                                                <span className="size_20 color_red">
                                                                    {DeliveryConfirmationMessage.DELIVERY_CLOSE_TODAY}
                                                                </span> </>)} </h5>
                                                    </div>}

                                                <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                    <a
                                                        className="light_orange_btn clock_more_btn"
                                                        onClick={handlerestaurantHoursPopup}
                                                        data-toggle="modal"
                                                        data-target="#myModal-2"
                                                    ><i className="fa fa-clock-o"></i> Change</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center small-text-left flush col-sm-1 col-xs-12">
                                            <div className="numbers">2</div>
                                        </div>
                                        <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                            {defaultLocation.isOrderingDisable || defaultLocation.isDeliveryOrderingDisable ?
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                                        <h3 className="color_red">
                                                            {defaultLocation.orderingMessage ? defaultLocation.orderingMessage : DeliveryConfirmationMessage.DELIVERY_CLOSE_TODAY_DESC}
                                                        </h3>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div className="row">
                                                        <div className="col-lg-12 col-sm-12 col-xs-12">
                                                            <h3>{DeliveryConfirmationMessage.ESTIMATED_DELIVERY_TIME}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="row margin_top_20">

                                                        <div className="col-lg-10 column-centered flush col-sm-10 col-xs-12">

                                                            <div className="col-lg-2"></div>
                                                            {deliveryWindow && deliveryWindow.length > 0 ?
                                                                <>
                                                                    {isDeliveryAsap === true &&
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a className={`light_orange_btn ${activeButtonClass == 'asap' ? 'active' : ''}`}
                                                                                onClick={handletimeclick}>ASAP</a>
                                                                        </div>}

                                                                    {isDeliveryPickupTime === true &&
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a className={`light_orange_btn ${activeButtonClass == 'lateron' ? 'active' : ''}`}
                                                                                onClick={handlelateronclick}
                                                                                data-toggle="modal"
                                                                                data-target="#myModal-timer">Later On
                                                                            </a>
                                                                        </div>}

                                                                    <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                                                                        {displayASAPTime && orderTime &&
                                                                            <h5 className="color_black">Today {MonthList(currentDate.getMonth())} {currentDate.getDate()}, {orderTime} </h5>

                                                                        }
                                                                        {displayASAPTime == false && timeOrErrorMessage &&
                                                                            <h5 className="color_black " style={redColorStyle}> {timeOrErrorMessage} </h5>
                                                                        }
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <a className="grey_btn disabled" href="javascript:void(0)" > ASAP </a>
                                                                    </div>
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <a className="grey_btn disabled" href="javascript:void(0)" >Later On </a>
                                                                    </div>
                                                                    <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                                                                        <h3 className="removembottom color_red">
                                                                            <br />
                                                                            {defaultLocation.isOrderingDisable === true && defaultLocation.orderingMessage ?
                                                                                defaultLocation.orderingMessage
                                                                                :
                                                                                (pickupWindow.length === 0 && deliveryWindow.length === 0) ?
                                                                                    PickUpConfirmationMessage.PICKUP_DELIVERY_TIME_CLOSED
                                                                                    :
                                                                                    DeliveryConfirmationMessage.CLOSE_TODAY
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                </>
                                                            }
                                                            {userinfo != undefined && userinfo != null &&
                                                                <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                                                                    <div className="col-lg-2"></div>
                                                                    {!defaultLocation.isOrderingDisable ?
                                                                        <>
                                                                            {orderTime && orderTime !== "" ?
                                                                                <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                                    <Link href="/[dynamic]/main" as={`/${restaurantinfo.restaurantURL}/main`}>
                                                                                        <a className="blue_btn skipbtn disabled">Next</a>
                                                                                    </Link>
                                                                                </div>
                                                                                :
                                                                                (<div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                                    <Custombutton buttonText="Next" buttonType="button" classname="blue_btn skipbtn disabled" disabledClass="blue_btn skipbtn disabled customdisable" isDisable={true} />
                                                                                </div>)
                                                                            }
                                                                            <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                                <Link href="/[dynamic]/main" as={`/${restaurantinfo.restaurantURL}/main`}>
                                                                                    <a className="light_orange_btn ">Skip to Menu</a>
                                                                                </Link>
                                                                            </div>
                                                                        </> : ('')}
                                                                </div>}
                                                            {(userinfo == undefined || userinfo == null) &&
                                                                <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                                                                    <div className="col-lg-8 margin_top_30 column-centered flush col-sm-12 col-xs-10">
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <Link href="/[dynamic]/main" as={`/${restaurantinfo.restaurantURL}/main`}>
                                                                                <a className="light_orange_btn ">Skip to Menu</a>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {
                    restaurantHoursPopup === true && (
                        <RestaurantTimmingComponent
                            locationId={restaurantinfo && restaurantinfo.defaultlocationId}
                            restaurantId={restaurantinfo && restaurantinfo.restaurantId}
                        />
                    )
                }
                {
                    addadresspopup === true &&
                    <AddAddress reloadAddressList={reloadAddressList} />
                }
                {timestate === true && <Choosetime ordertype={ordertype} restaurantinfo={restaurantinfo} restaurantWindowTime={restaurantWindowTime} isTakeAway={defaultLocation.istakeaway} isDelivery={defaultLocation.isdelivery} checktimeselected={checktimeselected} />}
                {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
            </>
        )
    }
    return <Loader />
}


export default Deliverywithlogin;