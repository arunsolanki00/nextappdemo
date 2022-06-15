import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { MemoizedHeaderLogoComponent } from '../../components/Header/headerlogo.component'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import RestaurantLocationsComponent from "../../components/Common/restaurant-locations.component";
import { restaurantsLocation, restaurantstiming } from "../../redux/restaurants/restaurants.action";
import RestaurantTimmingComponent from "../../components/Common/restaurant-timming.component";
import { getAddress } from "../../redux/delivery-address/delivery-address.action";
import LoginMainComponent from "../../components/login/login.component";
import Choosetime from "../../components/Common/choose-time.component";
// import { OrderServices } from "../../redux/order/order.services";
import { selecteddeliveryaddress, setpickupordelivery } from "../../redux/selected-delivery-data/selecteddelivery.action";
import { RestaurantsTypes } from "../../redux/restaurants/restaurants.types";
import Loader from "../../components/Common/loader/loader.component";
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from "../../components/helpers/static-message/pickupconfirmation2-message";
import { getSelectedRestaurantTime } from "../../redux/main/main.action";
import { OrderServices } from "../../redux/order/order.services";
import { emptyordertime, isasap, setordertime } from "../../redux/order/order.action";
import { OrderTypes } from "../../redux/order/order.types";
import { IndexSkeleton } from "../../components/Common/Skeleton/index-skeleton.component";

const IndexOld = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { query: { dynamic, id, category, items } } = router;

    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const timminginfo = useSelector(({ todaytimming }) => todaytimming);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const [loadpickupComplete, setLoadPickupComplete] = useState(false);
    const selecetdtime = useSelector(({ order }) => order.checktime);
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);

    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const restaurantdata = useSelector(({ restaurant }) => restaurant);

    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    //const restaurantlocation = useSelector(({ restaurant }) => restaurant.restaurantslocationlist);
    const [apiResponse, setapiResponse] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [displayASAPTime, setDisplayASAPTime] = useState(false);
    const [orderTime, setOrderTime] = useState();
    const [timeOrErrorMessage, setTimeOrErrorMessage] = useState("");
    const [activeButtonClass, setActiveButtonClass] = useState("");
    const [timestate, settimestate] = useState(false);
    const [locationpopup, setlocationpopup] = useState(false);
    const [restaurantHoursPopup, setrestaurantHoursPopup] = useState(false);

    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [meridiem, setMeridiem] = useState("");
    const [isDisabled, setisDisabled] = useState(true)
    const [redColorStyle, setredColorStyle] = useState({ color: "red" });
    const [loadingState, setloadingState] = useState(false);

    const handleLocationPopup = () => setlocationpopup(true);
    const handlerestaurantHoursPopup = () => setrestaurantHoursPopup(true);

    const logindetailsclick = () => setShowLogin(true);

    //pickup type order
    var ordertype = 1;
    const handletimeclick = (timeselect) => {
        
        OrderServices.getOrderTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((response) => {
            if (response) {
                console.log(response);
                
                if (timeselect === "asap" && response.result.message && response.result.message.length > 0 && response.result.isAvailable === false) {
                    setTimeOrErrorMessage(response.result.message);
                    settimestate(false);
                    setDisplayASAPTime(false);
                    dispatch(emptyordertime());

                    return;
                }
                if (response.result != undefined && response.result !== null) {

                    if (response.result.ordertime != undefined && response.result.ordertime !== null && response.result.ordertime !== "") {

                        let ordertimeArray = response.result.ordertime && response.result.ordertime.split(":");
                        let time = "";
                        if (ordertimeArray.length > 0) {
                            time = ordertimeArray[0] + ":" + ordertimeArray[1] + " " + ordertimeArray[2];
                        }
                        if (timeselect === "lateron") {
                            setOrderTime(response.result.ordertime);
                            settimestate(true);
                            //dispatch(isasap(false));
                        }
                        if (timeselect === "asap") {
                            setOrderTime(time);
                            settimestate(false);
                            dispatch(setordertime(time));
                            setisDisabled(false);
                        }
                    } else {
                        setTimeOrErrorMessage(PickUpConfirmationMessage.PICKUP_CLOSE_TODAY_DESC);
                        settimestate(false);
                        setDisplayASAPTime(false);

                    }
                }
            }
        });

        if (timeselect === "lateron") {
            setActiveButtonClass('lateron');
            dispatch(isasap(false));
        } else {
            setDisplayASAPTime(!displayASAPTime);

            // if(!displayASAPTime){
            //     setisDisabled(true)
            // }
            setActiveButtonClass('asap');
            dispatch(isasap(true));
        }
    }

    //call from child to parent for set selected time
    // function checktimeselected(selecetdtime) {
    //     console.log("selecetdtime :" + selecetdtime)
        
    //     if (selecetdtime) {
    //         let ordertimeArray = selecetdtime && selecetdtime.split(":");
    //         if (ordertimeArray.length > 1) {
    //             setDisplayASAPTime(true);
    //             setOrderTime(selecetdtime);
    //             dispatch(setordertime(selecetdtime))
    //             setisDisabled(false);
    //         } else {
    //             setTimeOrErrorMessage(selecetdtime);
    //             settimestate(false);
    //             setDisplayASAPTime(false);
    //             setisDisabled(false);
    //         }
    //     }
    // }

    //call from child to parent for set selected time
    function checktimeselected(selecetdtime, errorMessage) {
        if (selecetdtime !== "") {
            setDisplayASAPTime(true);
            setOrderTime(selecetdtime);
           // dispatch(setordertime(selecetdtime))
            setisDisabled(false);
        }
        if (errorMessage !== "") {
            //dispatch(setordertime(""))
            setTimeOrErrorMessage(errorMessage);
            settimestate(false);
            setDisplayASAPTime(false);
            setisDisabled(false);
        }
    }

    useEffect(() => {
        setloadingState(true);
        const fetchData = async () => {
            const getResponse = await restaurantsLocation(restaurantinfo && restaurantinfo.restaurantId, "0", "0");
            dispatch(setpickupordelivery('Pickup'));
            dispatch(selecteddeliveryaddress(null));// as we do not need delivery address selected            

            dispatch(restaurantstiming(restaurantinfo && restaurantinfo.defaultlocationId, restaurantinfo && restaurantinfo.restaurantId));
            // dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
            dispatch({
                type: RestaurantsTypes.RESTAURANT_LOCATION_LIST,
                payload: getResponse
            })
            dispatch(getSelectedRestaurantTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));

            setapiResponse(getResponse);
            setLoadPickupComplete(true);
        };
        const timer = setTimeout(() => {
            fetchData();
        }, 1000);
        setloadingState(false);
        return () => clearTimeout(timer);

    }, [restaurantinfo.defaultLocation.locationId])

    if (!loadingState && loadpickupComplete) {
        return (

            <>
                {/* <IndexSkeleton/> */}
                <section id="pickup" className="checkout">
                    <div className="container">
                        <div className="row">
                            <MemoizedHeaderLogoComponent />
                            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                                <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                    {userinfo && <h1 className="margin_bottom_30">Hi {userinfo && userinfo.firstname}, hungry?</h1>}
                                </div>
                            </div>
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
                                                    <h3>{PickUpConfirmationMessage.RESTAURANT_INFO}</h3>
                                                    <form className="customForm hide">
                                                        <div className="col-lg-12 flush-left col-sm-12 col-xs-12">
                                                            <input className="search" type="text" placeholder="Enter address or postal code or city…" required />
                                                            <label className="formlabel search">Enter address or postal code or city…</label>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="row in">
                                                <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                                    <div className="col-lg-8 col-sm-8 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pin.png" alt="" />
                                                            {restaurantinfo && restaurantinfo.defaultLocation.locationName}
                                                            <br />
                                                            <span className="size_20 color_grey">
                                                                {`${restaurantinfo && restaurantinfo.defaultLocation.address1},  ${restaurantinfo && restaurantinfo.defaultLocation.cityname + " , " + restaurantinfo.defaultLocation.zipcode}`}
                                                            </span></h5>
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-phone"></i>
                                                            <span className="size_20 color_grey">
                                                                {restaurantinfo && restaurantinfo.defaultLocation.phone}
                                                            </span></h5>
                                                    </div>
                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">

                                                        {(apiResponse.addressList && apiResponse.addressList.length > 1) &&

                                                            <a className="light_orange_btn clock_more_btn"
                                                                onClick={handleLocationPopup}
                                                                data-toggle="modal"
                                                                data-target="#myModal"><i className="fa fa-map-marker"></i> More
                                                            </a>
                                                        }

                                                    </div>
                                                </div>
                                                {defaultLocation.istakeaway && pickupWindow && pickupWindow.length > 0 ?
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{PickUpConfirmationMessage.PICKUP_WINDOWS}<br /><a data-toggle="modal" data-target="#myModal-2"><span className="size_20 color_grey">
                                                            {pickupWindow && pickupWindow.map((time, index) => {
                                                                return (<div key={Math.random()}> {time}
                                                                    <br /></div>)
                                                            })}
                                                        </span></a></h5>
                                                    </div>
                                                    : <><div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{PickUpConfirmationMessage.PICKUP_WINDOWS}<br /><a data-toggle="modal" data-target="#myModal-2"><span className="size_20 color_grey">
                                                            {PickUpConfirmationMessage.PICKUP_CLOSE_TODAY}
                                                        </span></a></h5>
                                                    </div></>}
                                                {defaultLocation.isdelivery && deliveryWindow && deliveryWindow.length > 0 ?
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br /><span className="size_20 color_grey">
                                                            {deliveryWindow && deliveryWindow.map((data, index) => {
                                                                return (<>{data}
                                                                    <br /></>)
                                                            })}
                                                        </span></h5>
                                                    </div>
                                                    : <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-clock-o"></i>{DeliveryConfirmationMessage.DELIVERY_WINDOWS}<br /><span className="size_20 color_grey">
                                                            {PickUpConfirmationMessage.DELIVERY_CLOSE_TODAY}
                                                        </span></h5>
                                                    </div>}
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
                                    {defaultLocation.istakeaway ?
                                        <>
                                            <div className="row row-eq-height">
                                                <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                                    <div className="numbers">2</div>
                                                </div>
                                                {defaultLocation.isOrderingDisable ?
                                                    <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                                <h3>{defaultLocation.orderingMessage ? defaultLocation.orderingMessage : PickUpConfirmationMessage.CLOSE_TODAY}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                                <h3>{PickUpConfirmationMessage.SELECT_PICKUP_TIME}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-8 column-centered flush margin_top_10 col-sm-10 col-xs-12">
                                                                {(pickupWindow && pickupWindow.length > 0) ?
                                                                    <>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a className={`grey_btn ${activeButtonClass == 'asap' ? 'active' : ''}`} onClick={() => handletimeclick('asap')} >ASAP</a>
                                                                        </div>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a className={`grey_btn ${activeButtonClass == 'lateron' ? 'active' : ''}`}
                                                                                onClick={() => handletimeclick('lateron')}
                                                                                data-toggle="modal"
                                                                                data-target="#myModal-timer">Later On</a>
                                                                        </div>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        </div>
                                                                        <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                                                                            <h5 className="removembottom color_black">
                                                                                {displayASAPTime && orderTime &&
                                                                                    <a data-toggle="modal">Today at {orderTime} </a>
                                                                                }
                                                                                {displayASAPTime == false && timeOrErrorMessage &&
                                                                                    <a data-toggle="modal" data-target="#myModal-timer" style={redColorStyle} > {timeOrErrorMessage} </a>
                                                                                }
                                                                            </h5>
                                                                        </div>
                                                                    </> :
                                                                    <>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a href="javascript:void(0)" className="grey_btn disabled">ASAP</a>
                                                                        </div>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                            <a href="javascript:void(0)" className="grey_btn disabled">Later On</a>
                                                                        </div>
                                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        </div>
                                                                        <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                                                                            <h3 className="removembottom color_black">
                                                                                {PickUpConfirmationMessage.PICKUP_CLOSE_TODAY_DESC}
                                                                            </h3>
                                                                        </div>
                                                                    </>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="row row-eq-height">

                                                <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-sm-12 col-xs-12">
                                                        </div>
                                                        <div className="col-lg-12  btns text-center col-sm-12 col-xs-12">
                                                            <a className="active">
                                                                <span>
                                                                    <img className="white" src="/images/icon-1-white.svg" alt="" />
                                                                    <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                                            </a>
                                                            {defaultLocation.isdelivery ?
                                                                (
                                                                    <Link href="/[dynamic]/delivery" as={`/${restaurantinfo.restaurantURL}/delivery`}>
                                                                        <a className="">
                                                                            <span>
                                                                                <img className="white" src="/images/icon-2-white.svg" alt="" />
                                                                                <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                                                        </a>
                                                                    </Link>) : ('')}
                                                        </div>
                                                        {userinfo != undefined && userinfo != null &&
                                                            <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                                                                {isDisabled ?
                                                                    <a className="blue_btn blue_btn_porder disabled" disabled>Next</a>
                                                                    :
                                                                    <Link href="/[dynamic]/main" as={`/${restaurantinfo.restaurantURL}/main`}>
                                                                        <a className="blue_btn blue_btn_porder ">Next</a>
                                                                    </Link>
                                                                }
                                                            </div>}

                                                        {(userinfo == undefined || userinfo == null) &&
                                                            <div className="col-lg-12 margin_top_30 cal text-center col-sm-12 col-xs-12">
                                                                <div className="col-lg-8 margin_top_30 column-centered flush col-sm-12 col-xs-10">
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <a className="orange_side_btn orange_bord_btn"
                                                                            data-toggle="modal"
                                                                            data-target="#myModal-logintest"
                                                                            onClick={() => logindetailsclick()}>Login
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <Link href="/[dynamic]/register" as={`/${restaurantinfo.restaurantURL}/register`}>
                                                                            <a className="orange_side_btn orange_bord_btn">Register</a>
                                                                        </Link>
                                                                    </div>
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <Link href="/[dynamic]/main" as={`/${restaurantinfo.restaurantURL}/main`}>
                                                                            <a className="blue_btn skipbtn active">Skip</a>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </> :
                                        <>
                                            <div className="row row-eq-height">
                                                <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                                    <div className="numbers">2</div>
                                                </div>
                                                <h5 className="size_22 color_black weight_300 margin_bottom_20">
                                                    {PickUpConfirmationMessage.CLOSE_TODAY}
                                                </h5>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {
                    locationpopup === true && (
                        <RestaurantLocationsComponent restaurantId={restaurantinfo && restaurantinfo.defaultLocation.restaurantId} />
                    )
                }

                {
                    restaurantHoursPopup === true && (
                        <RestaurantTimmingComponent
                            locationId={restaurantinfo && restaurantinfo.defaultlocationId}
                            restaurantId={restaurantinfo && restaurantinfo.restaurantId}
                        />
                    )
                }

                {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}

                {timestate === true && orderTime && <Choosetime ordertime={orderTime} ordertype={ordertype} checktimeselected={checktimeselected} />}
            </>
        );
    }
    return <IndexSkeleton />
}

export default IndexOld;