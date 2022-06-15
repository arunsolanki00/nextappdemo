import React, { useState, useEffect } from "react";
import Image from "next/image";
import MenuItemIntroComponent from "../../../components/MenuCategory/menuitemintro.component";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import RestaurantLocationsComponent from "../../../components/Common/restaurant-locations.component";
import { restaurantsdetail, restaurantsLocation, restaurantstiming } from "../../../redux/restaurants/restaurants.action";
import RestaurantTimmingComponent from "../../../components/Common/restaurant-timming.component";
import LoginMainComponent from "../../../components/login/login.component";
import Choosetime from "../../../components/Common/choose-time.component";
import { selecteddeliveryaddress, setpickupordelivery } from "../../../redux/selected-delivery-data/selecteddelivery.action";
import { RestaurantsTypes } from "../../../redux/restaurants/restaurants.types";
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from "../../../components/helpers/static-message/pickupconfirmation2-message";
import { getSelectedRestaurantTime } from "../../../redux/main/main.action";
import { OrderServices } from "../../../redux/order/order.services";
import { emptyordertime, isasap, setordertime } from "../../../redux/order/order.action";
import { IndexSkeleton } from "../../../components/Common/Skeleton/index-skeleton.component";
import { MonthList } from "../../../components/helpers/utility";
import { MemoizedHeaderLogoComponent } from "../../../components/Header/headerlogo.component";
import { ENDPOINTS } from "../../../components/config";
import { setLocationIdInStorage } from "../../../components/Common/localstore";
import { deleteCartItemFromSessionId, emptycart, initialrewardpoint } from "../../../redux/cart/cart.action";
import { getAuthKey } from "../../../components/Common/auth";
const Index = () => {
     
    const router = useRouter();
    const { query: { dynamic,location ,id, category, items } } = router;
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const addressList = useSelector(({ restaurant }) => restaurant?.restaurantslocationlist?.addressList);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const [loadpickupComplete, setLoadPickupComplete] = useState(false);
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const restauranttiming = useSelector(({ restaurant }) => restaurant.restaurantstiminglist);
    const isTakeOutAsap = defaultLocation.isTakeOutAsap;
    let sessionid = useSelector(({ session }) => session?.sessionid);
    const isTakeOutPickupTime = defaultLocation.isTakeOutPickupTime;
    const isDeliveryPickupTime = defaultLocation.isDeliveryPickupTime;
    const isDeliveryAsap = defaultLocation.isDeliveryAsap;
    const [apiResponse, setapiResponse] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [displayASAPTime, setDisplayASAPTime] = useState(false);
    const [orderTime, setOrderTime] = useState();
    const [timeOrErrorMessage, setTimeOrErrorMessage] = useState("");
    const [activeButtonClass, setActiveButtonClass] = useState("");
    const [timestate, settimestate] = useState(false);
    const [locationpopup, setlocationpopup] = useState(false);
    const [restaurantHoursPopup, setrestaurantHoursPopup] = useState(false);
    const [isDisabled, setisDisabled] = useState(true)
    const [loadingState, setloadingState] = useState(false);
    const [restauranttimingList, setrestauranttimingList] = useState();
    const [load, setLoad] = useState(0)
    const handlerestaurantHoursPopup = () => {
        setrestauranttimingList(restauranttiming);
        setrestaurantHoursPopup(true);
    };
    const [currentDate, setcurrentDate] = useState();

    const logindetailsclick = () =>{
        setShowLogin(true);
    } 

    useEffect(() => {
        let date = new Date();
        setcurrentDate(date);
    }, []);

    //pickup type order
    var ordertype = 1;
    const handletimeclick = (timeselect) => {
        setTimeOrErrorMessage("");
        setDisplayASAPTime(!displayASAPTime);
        setActiveButtonClass('asap');
        OrderServices.getOrderTiming(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, ordertype).then((gettimeresponse) => {
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
                                setisDisabled(true)
                                return;
                            }
                            if (response.result != undefined && response.result !== null) {
                                if (response.result?.status === "success") {
                                    let newtime = time[0] + ' ' + time[1];
                                    setOrderTime(newtime);
                                    dispatch(setordertime(newtime));
                                    setisDisabled(false);
                                } else {
                                    setTimeOrErrorMessage(response.result.message);
                                    setDisplayASAPTime(false);
                                    setisDisabled(true)
                                }
                                setDisplayASAPTime(!displayASAPTime);
                                setActiveButtonClass('asap');
                                dispatch(isasap(true));
                            }
                        });
                }
            }
        });
    }
    const handlelateronclick = () => {
        setTimeOrErrorMessage("");
        setActiveButtonClass('lateron');
        settimestate(true);
        dispatch(isasap(false));
    }

    //call from child to parent for set selected time
    function checktimeselected(selecetdtime, errorMessage) {
        if (selecetdtime !== "") {
            setDisplayASAPTime(true);
            setOrderTime(selecetdtime);
            dispatch(setordertime(selecetdtime))
            setisDisabled(false);
        }
        if (errorMessage !== "") {
            //dispatch(setordertime(""))
            setTimeOrErrorMessage(errorMessage);
            settimestate(false);
            setisDisabled(true);
        }
    }

    useEffect(() => {
        if (restaurantinfo && restaurantinfo.defaultlocationId === 0) {
            router.push("/" + restaurantinfo.restaurantURL +"/"+location+ "/restaurant-close");
        }
        if (defaultLocation?.istakeaway != undefined && defaultLocation?.istakeaway === false && defaultLocation?.isdelivery === true) {
            router.push("/" + restaurantinfo.restaurantURL +"/"+location+"/delivery");
        }
        if ((isTakeOutAsap === false && isTakeOutPickupTime === false) && (isDeliveryPickupTime || isDeliveryAsap))
            router.push("/" + restaurantinfo.restaurantURL +"/"+location+"/delivery");
    }, []);

    useEffect(() => {
         
            setloadingState(true);
            const fetchData = async () => {
                const getResponse = await restaurantsLocation(restaurantinfo && restaurantinfo.restaurantId, "0", "0");
                dispatch(setpickupordelivery('Pickup'));
                dispatch(selecteddeliveryaddress(null));// as we do not need delivery address selected            
                dispatch(restaurantstiming(restaurantinfo && restaurantinfo.defaultlocationId, restaurantinfo && restaurantinfo.restaurantId));
                dispatch({
                    type: RestaurantsTypes.RESTAURANT_LOCATION_LIST,
                    payload: getResponse
                })
                dispatch(getSelectedRestaurantTime(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
                setapiResponse(getResponse);
                setLoadPickupComplete(true);
                dispatch(emptyordertime());
            };
            const timer = setTimeout(() => {
                fetchData();
            }, 1000);
            setloadingState(false);
            setOrderTime("")
            setTimeOrErrorMessage("")
            setActiveButtonClass("")
            setrestauranttimingList(restauranttiming);
    }, [restaurantinfo.defaultLocation?.locationId]);
    
const setRestaurantLocation=async(locationId)=>{
     
    const request = await fetch(ENDPOINTS.LOCATION_BY_ID, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': getAuthKey(restaurantinfo.restaurantId)
        },
        body: JSON.stringify({
          restaurantId: restaurantinfo.restaurantId,
          locationId: locationId
        })
      });
      const response = await request.json();
       
      var data = await JSON.parse(response.d);
      Object.keys(restaurantinfo).map((session) => {
        if (session === 'defaultLocation') {
          Object.assign(restaurantinfo.defaultLocation, data.result);
        }
        if (session === 'defaultlocationId') {
          restaurantinfo.defaultlocationId = data.result.locationId;
        };
      });
      dispatch(restaurantsdetail(null));
      dispatch(restaurantsdetail(restaurantinfo));
      setLocationIdInStorage(restaurantinfo.defaultlocationId);
      if (userinfo && userinfo?.customerId) {
        deleteCartItemFromSessionId(sessionid, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId);
        dispatch(emptycart());
        dispatch(initialrewardpoint(userinfo));
      }
      setLoad(load+1)
}

    useEffect(()=>{ 
        console.log("res info ",restaurantinfo)
        let defaultLocationUrl=defaultLocation.locationURL.toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "");
        if(location.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "")!== defaultLocationUrl ){
        if(addressList !== undefined){
            addressList.map(address=>{
               let locationName=address.locationURL.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "") 
               if(locationName === location.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "") ){
                 
                setRestaurantLocation(address.locationId)
               }else{
                setLoad(0)
               }
            })
        }
    }
    else{
        setLoad(load+1)
    }
    },[addressList])


    const handleLocationPopup = (isLocationPopup) => {
          setlocationpopup(isLocationPopup) 
    }

    if (!loadingState && loadpickupComplete && load>0) {
        return (
            <>
                <>
                    {/* <IndexSkeleton/> */}
                    <section id="pickup" className="checkout">
                        <div className="container">
                            <div className="row">
                                <MemoizedHeaderLogoComponent />
                                <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                        {userinfo && userinfo.firstname ? <h1 className="margin_bottom_30">Hi {userinfo.firstname}, hungry?</h1> : <h1 className="margin_bottom_30">Hey there!</h1>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                                    <Link href="/[dynamic]/[location]/pickup" as={`/${restaurantinfo.restaurantURL}/${location}/pickup`}>
                                        <a className="active" >
                                            <span>
                                                <img className="white" src="/images/icon-1-white.svg" alt="" />
                                                <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                        </a>
                                    </Link> 
                                    {(isDeliveryPickupTime || isDeliveryAsap) &&
                                        <>
                                            {defaultLocation.isdelivery === true && deliveryWindow && deliveryWindow.length > 0 ?
                                                <Link href="/[dynamic]/[location]/delivery" as={`/${restaurantinfo.restaurantURL}/${location}/delivery`}>
                                                    <a className="">
                                                        <span>
                                                            <img className="white" src="/images/icon-2-white.svg" alt="" />
                                                            <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                                    </a>
                                                </Link>
                                                :
                                                <a className="" style={{ backgroundColor: "lightgrey" }}>
                                                    <span>
                                                        <img className="white" src="/images/icon-2-orange.PNG" alt="" />
                                                        <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                                </a>
                                            }
                                        </>
                                    }

                                </div>
                                <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
                                    <div className="col-lg-10 column-centered col-sm-12 col-xs-12">
                                        <div className="row row-eq-height">
                                            <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                                <div className="numbers">1</div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                        <h3>{PickUpConfirmationMessage.SELECT_PICKUP_TIME}</h3>
                                                    </div>
                                                </div>
                                                <div className="row in" >
                                                    <div className="col-lg-8 column-centered flush margin_top_10 col-sm-10 col-xs-12">
                                                        {(defaultLocation.isOrderingDisable === false && defaultLocation.isTakeoutOrderingDisable === false && (pickupWindow && pickupWindow.length > 0)) ?
                                                            <>
                                                                {isTakeOutAsap === true  && <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                    <a className={`light_orange_btn ${activeButtonClass == 'asap' ? 'active' : ''}`} onClick={handletimeclick} >ASAP</a>
                                                                </div>
                                                                }
                                                                {isTakeOutPickupTime === true &&
                                                                    <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                        <a className={`light_orange_btn ${activeButtonClass == 'lateron' ? 'active' : ''}`}
                                                                            onClick={handlelateronclick}
                                                                            data-toggle="modal"
                                                                            data-target="#myModal-timer">Later On</a>
                                                                    </div>
                                                                }
                                                                <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                                </div>
                                                                <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                                                                    <h5 className="removembottom color_black">
                                                                        {displayASAPTime && orderTime &&
                                                                            // <a data-toggle="modal">Today at {orderTime} </a>
                                                                            <a data-toggle="modal">Today {MonthList(currentDate.getMonth())} {currentDate.getDate()}, {orderTime} </a>
                                                                        }
                                                                        {displayASAPTime == false && timeOrErrorMessage &&
                                                                            <a data-toggle="modal" className="color_red" data-target="#myModal-timer" > {timeOrErrorMessage} </a>
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
                                                                    <h3 className="removembottom color_red">
                                                                        <br />
                                                                        {defaultLocation.isOrderingDisable === true && defaultLocation.orderingMessage ?
                                                                            defaultLocation.orderingMessage
                                                                            :
                                                                            (pickupWindow?.length === 0 && deliveryWindow?.length === 0) ?
                                                                                PickUpConfirmationMessage.PICKUP_DELIVERY_TIME_CLOSED
                                                                                :
                                                                                PickUpConfirmationMessage.PICKUP_CLOSE_TODAY_DESC
                                                                        }
                                                                    </h3>
                                                                </div>
                                                            </>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row row-eq-height">
                                            <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                                <div className="numbers">2</div>
                                            </div>
                                            <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                        <h3>{PickUpConfirmationMessage.RESTAURANT_INFO}</h3>
                                                    </div>
                                                </div>
                                                <div className="row in">
                                                    <div className="col-lg-12 flush col-sm-12 col-xs-12">
                                                        <div className="col-lg-8 col-sm-8 col-xs-12">
                                                            <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pin.png" alt="" />
                                                                {restaurantinfo && restaurantinfo.restaurantname}
                                                                <br />
                                                                <span className="size_20 color_grey">
                                                                    {`${restaurantinfo &&  restaurantinfo.defaultLocation.address1},  ${restaurantinfo && restaurantinfo.defaultLocation.cityname + " , " + restaurantinfo.defaultLocation.zipcode}`}
                                                                </span></h5>
                                                            <h5 className="size_22 color_black weight_300 margin_bottom_20"><i className="fa fa-phone"></i>
                                                                <span className="size_20 color_grey">
                                                                    {restaurantinfo && restaurantinfo.defaultLocation.phone}
                                                                </span></h5>
                                                        </div>
                                                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                                                            {(apiResponse.addressList && apiResponse.addressList.length > 1) &&
                                                                <a className="light_orange_btn clock_more_btn"
                                                                    onClick={()=>handleLocationPopup(true)}
                                                                    data-toggle="modal"
                                                                    data-target="#myModal"><i className="fa fa-map-marker"></i> Change
                                                                </a>
                                                            }
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

                                            <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                                    </div>
                                                    <div className="col-lg-12 cal text-center col-sm-12 col-xs-12">
                                                        <div className="col-lg-12 column-centered flush col-sm-10 col-xs-10">
                                                            <div className="col-lg-3 text-center col-sm-3 col-xs-12">

                                                                {(userinfo == undefined || userinfo == null) &&
                                                                    <a className="orange_side_btn orange_bord_btn"
                                                                        data-toggle="modal"
                                                                        data-target="#myModal-logintest"
                                                                        onClick={() => logindetailsclick()}>Login
                                                                    </a>
                                                                }
                                                            </div>
                                                            <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                                                                {isDisabled ?
                                                                    <a className="blue_btn blue_btn_porder disabled" disabled>Next</a>
                                                                    :
                                                                    <Link href="/[dynamic]/[location]/main" as={`/${restaurantinfo.restaurantURL}/${location}/main`}>
                                                                        <a className="blue_btn blue_btn_porder ">Next</a>
                                                                    </Link>
                                                                }
                                                            </div>
                                                            <div className="col-lg-3 text-center col-sm-3 col-xs-12">
                                                                <Link href="/[dynamic]/[location]/main" as={`/${restaurantinfo.restaurantURL}/${location}/main`}>
                                                                    <a className="light_orange_btn">Skip to Menu</a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {
                        locationpopup === true && (
                            <RestaurantLocationsComponent restaurantId={restaurantinfo && restaurantinfo.defaultLocation.restaurantId} handleLocationPopup={handleLocationPopup} />
                        )
                    }
                    {
                        restaurantHoursPopup === true && (
                            <RestaurantTimmingComponent
                                locationId={restaurantinfo && restaurantinfo.defaultlocationId}
                                restaurantId={restaurantinfo && restaurantinfo.restaurantId}
                                restauranttimingList={restauranttimingList}
                                id={Math.random()}
                            />
                        )
                    }
                    {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
                    {timestate === true && <Choosetime ordertype={ordertype} restaurantinfo={restaurantinfo} restaurantWindowTime={restaurantWindowTime} isTakeAway={defaultLocation.istakeaway} isDelivery={defaultLocation.isdelivery} checktimeselected={checktimeselected} />}
                </>
            </>
        );
    }
    else{
        return <>Loading...</>
    }
    // return <IndexSkeleton/>
}

export default Index;