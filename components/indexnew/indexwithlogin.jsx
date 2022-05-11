import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DeliveryAddressServices } from '../../redux/delivery-address/delivery-address.services';
import { restaurantsdetail, restaurantsLocation } from '../../redux/restaurants/restaurants.action';
import { RestaurantsTypes } from '../../redux/restaurants/restaurants.types';
import { ENDPOINTS } from '../config';
import { MemoizedHeaderLogoComponent } from '../Header/headerlogo.component'
import Link from "next/link";
import { selecteddeliveryaddress } from '../../redux/selected-delivery-data/selecteddelivery.action';
import { setLocationIdInStorage } from '../Common/localstore';
import { getAuthKey } from '../Common/auth';
import GoogleAddress from '../Common/Address/google-address.component';
import LoginMainComponent from '../login/login.component';
import { GoogleAutoComplete } from '../Common/google.map.component';
import { AddTempDeliveryAddress, DeleteTempDeliveryAddress } from '../../redux/delivery-address/delivery-address.action';
import { useRouter } from 'next/router';
import { IndexSkeleton } from '../Common/Skeleton/index-skeleton.component';

function IndexWithLogin() {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const [addressList, setAddressList] = useState([]);

    // const [businessAddresses, setBusinessAddresses] = useState();
    const [personalAddresses, setPersonalAddresses] = useState();
    const [loadComplete, setLoadComplete] = useState(false);

    const [displayNext, setDisplayNext] = useState(false);
    const [ismore, setismore] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const [selectedAddressId, setselectedAddressId] = useState(0);
    const [selectedDeliveryAddressId, setselectedDeliveryAddressId] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [addressdetail, setaddressdetail] = useState({ address1: '', city: '', state: '', country: '', zipcode: '', latitude: '', longitude: '' });
    const tempDeliveryAddress = useSelector(({ deliveryaddress }) => deliveryaddress.tempDeliveryAddress);

    const isTakeOutAsap = restaurantinfo.defaultLocation.isTakeOutAsap;
    const isTakeOutPickupTime = restaurantinfo.defaultLocation.isTakeOutPickupTime;
    // const isDeliveryPickupTime = defaultLocation.isDeliveryPickupTime;
    // const isDeliveryAsap = defaultLocation.isDeliveryAsap;

    const [loadingState, setloadingState] = useState(false);
    //const [loadIndexComplete, setLoadIndexComplete] = useState(false);


    useEffect(() => {
        //setloadingState(true);
        const fetchData = async () => {
            const getResponse = await restaurantsLocation(restaurantinfo && restaurantinfo.restaurantId, "0", "0");

            if (getResponse.addressList.length === 1) {
                router.push("/" + restaurantinfo.restaurantURL + "/pickup");
            } else {
                dispatch({
                    type: RestaurantsTypes.RESTAURANT_LOCATION_LIST,
                    payload: getResponse.addressList
                })
                console.log(getResponse.addressList);
                setAddressList(getResponse.addressList);
                //setLoadPickupComplete(true);
                setloadingState(true);
            }
        };
        const timer = setTimeout(() => {
            fetchData();
        }, 1000);
        // setloadingState(false);
        return () => clearTimeout(timer);
    }, [restaurantinfo.defaultLocation?.locationId])

    useEffect(() => {
        if (tempDeliveryAddress) {
            if (tempDeliveryAddress.restaurantId === restaurantinfo.restaurantId)
                setaddressdetail(tempDeliveryAddress);
            else
                dispatch(DeleteTempDeliveryAddress());
        }
    }, []);

    useEffect(() => {
        if (userinfo && userinfo?.customerId > 0) {
            DeliveryAddressServices.getDeliveryAddress(userinfo.customerId, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId).then(
                (response) => {
                    if (response) {
                        if (response.AddressLists) {
                            let personalAddress = response.AddressLists.filter(function (personal) {
                                return personal.addresstype == 0;
                            });
                            console.log(personalAddress);
                            let businessAddress = response.AddressLists.filter(function (business) {
                                return business.addresstype == 1;
                            });
                            console.log(businessAddress);
                            //setBusinessAddresses(businessAddress);
                            // setPersonalAddresses(personalAddress);
                            var addressList = [...personalAddress, ...businessAddress];
                             
                            setPersonalAddresses(addressList);
                        }
                    }
                }
            );
            setLoadComplete(true);
        }
    }, [userinfo, userinfo?.customerId]);

    const handleSelectDelivery = (item) => {
        if (item) {
            setselectedDeliveryAddressId(item.deliveryaddressId);
            dispatch(selecteddeliveryaddress(item));
        }
    }

    const handleClick = async (lid) => {
        if (lid) {
            setselectedAddressId(lid);
            setDisplayNext(true);

            const request = await fetch(ENDPOINTS.LOCATION_BY_ID, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': getAuthKey(restaurantinfo.restaurantId)
                },
                body: JSON.stringify({
                    restaurantId: restaurantinfo.restaurantId,
                    locationId: lid
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
            dispatch(restaurantsdetail(restaurantinfo));
            setLocationIdInStorage(restaurantinfo.defaultlocationId);
        }
    }
    const handlemoreclick = (item) => setismore(!item);
    const logindetailsclick = () => setShowLogin(true);

    const sendToParent = (index) => {
         
        console.log(index);
        var obj = {
            address1: index.address1,
            city: index.city,
            state: index.state,
            country: index.country,
            zipcode: index.zip,
            latitude: index.lat,
            longitude: index.lng,
            restaurantId: restaurantinfo.restaurantId
        };

        setaddressdetail(prevAddress => {
            return {
                ...prevAddress,
                address1: index.address1,
                city: index.city,
                state: index.state,
                country: index.country,
                zipcode: index.zip,
                latitude: index.lat,
                longitude: index.lng,
                restaurantId: restaurantinfo.restaurantId
            }
        });
        dispatch(AddTempDeliveryAddress(obj))
    }
    // useEffect(() => {
    //     if (restaurantinfo && userinfo) {
    //         dispatch(getAddress(userinfo ? userinfo.customerId : 0, restaurantinfo.restaurantId, restaurantinfo.defaultlocationId));
    //     }
    // }, [loadComplete]);

    return (
        <>
            {loadingState === true ?
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
                            <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
                                <div className="col-lg-10 column-centered col-sm-12 col-xs-12">

                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">1</div>
                                            <div className="line"></div>
                                        </div>

                                        <div className="col-lg-12 sp-d col-sm-12 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3 className='color_orange'> Address </h3>
                                                </div>
                                            </div>
                                            {userinfo !== null ?
                                                <>
                                                    <div className="row in">
                                                        {personalAddresses && personalAddresses.map((paddress, index) => {
                                                            if (index < 4 && ismore === false)
                                                                return (
                                                                    <div key={index}>
                                                                        {index % 2 === 0 &&
                                                                            <a onClick={() => handleSelectDelivery(paddress)}  >
                                                                                <div className="col-lg-6 col-sm-6" style={{ height: '160px' }}>
                                                                                    <div className={'col-lg-12 col-sm-12  padding_10 margin_top_6 border_radius_20 ' + (selectedDeliveryAddressId > 0 && (paddress.deliveryaddressId === selectedDeliveryAddressId) ? 'full_grey_border_selected' : 'full_grey_border')}>
                                                                                        <span className="size_20 color_grey" ><span className='color_black size_20'>  <span className='color_orange'>Address {index} </span>
                                                                                            <br></br> {paddress.address1 && paddress.address1.replace(",", " ") + ", "} </span>
                                                                                            <br></br> {paddress.address2 && paddress.address2.replace(",", " ") + ", "}
                                                                                            {paddress.landmark && paddress.landmark.replace(",", " ") + ", "}
                                                                                            {paddress.city && paddress.city.replace(",", " ") + ", "}
                                                                                            {paddress.zipcode && paddress.zipcode.replace(",", " ")}
                                                                                            <br></br>
                                                                                            <br></br>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        }

                                                                        {index % 2 != 0 &&
                                                                            // <a onClick={() => handleSelectDelivery(paddress)} >
                                                                            //     <div className="col-lg-6 col-sm-6" style={{ height: '160px' }}>
                                                                            //         <div className={'col-lg-12 col-sm-12  padding_10 margin_top_6 margin_bottom_6 border_radius_20 ' + (selectedDeliveryAddressId > 0 && (paddress.deliveryaddressId === selectedDeliveryAddressId) ? 'full_grey_border_selected' : 'full_grey_border')}>
                                                                            //             <span className="size_20 color_grey" ><span className='color_black size_20'>
                                                                            //                 <span className='color_orange'>Address {index} </span>
                                                                            //                 {paddress.businessname && <><br></br> {paddress.businessname.replace(",", ", ")}</>} </span>
                                                                            //                 {paddress.address1 && <><br></br> {paddress.address1.replace(",", ", ")}</>} 
                                                                            //                 {paddress.address2 && <><br></br> {paddress.address2.replace(",", ", ")} </>}
                                                                            //                 {paddress.landmark && <><br></br> {paddress.landmark.replace(",", ", ")} </>}
                                                                            //                 {paddress.city && <><br></br> {paddress.city.replace(",", ", ")}</>}
                                                                            //                 {paddress.zipcode && <><br></br> {paddress.zipcode.replace(",", " ")} </>}
                                                                            //             </span>
                                                                            //         </div>
                                                                            //     </div>
                                                                            // </a>
                                                                            <a onClick={() => handleSelectDelivery(paddress)} >
                                                                                <div className="col-lg-6 col-sm-6" style={{ height: '160px' }}>
                                                                                    <div className={'col-lg-12 col-sm-12  padding_10 margin_top_6 border_radius_20 ' + (selectedDeliveryAddressId > 0 && (paddress.deliveryaddressId === selectedDeliveryAddressId) ? 'full_grey_border_selected' : 'full_grey_border')}>
                                                                                    <span className="size_20 color_grey" >
                                                                                    <span className='color_black size_20'>
                                                                                        <span className='color_orange'>Address {index} <br></br> </span> </span>
                                                                                    {paddress.businessname && <><span className='color_black size_20'>  {paddress.businessname.replace(",", " ") + ", "} </span>  </>}
                                                                                    {paddress.address1 && <><span className='color_black size_20'>   {paddress.address1.replace(",", " ") + ", "} </span> </>}
                                                                                    {paddress.address2 && <> <br></br> {paddress.address2.replace(",", " ") + ", "}  </>}
                                                                                    <br></br>
                                                                                    {paddress.landmark && paddress.landmark.replace(",", " ") + ", "}
                                                                                    {paddress.city && paddress.city.replace(",", " ") + ", "}
                                                                                    {paddress.zipcode && paddress.zipcode.replace(",", " ")}
                                                                                    <br></br>
                                                                                    <br></br>
                                                                                </span>
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        }
                                                                    </div>
                                                                )

                                                            if (ismore === true)
                                                                return (
                                                                    <a onClick={() => handleSelectDelivery(paddress)} >
                                                                        <div className="col-lg-6 col-sm-6" style={{ minHeight: '160px' }}>
                                                                            <div className={'col-lg-12 col-sm-12  padding_10 margin_top_6 border_radius_20 ' + (selectedDeliveryAddressId > 0 && (paddress.deliveryaddressId === selectedDeliveryAddressId) ? 'full_grey_border_selected' : 'full_grey_border')}>
                                                                                <span className="size_20 color_grey" >
                                                                                    <span className='color_black size_20'>
                                                                                        <span className='color_orange'>Address {index} <br></br> </span> </span>
                                                                                    {paddress.businessname && <><span className='color_black size_20'>  {paddress.businessname.replace(",", " ") + ", "} </span>  </>}
                                                                                    {paddress.address1 && <><span className='color_black size_20'>   {paddress.address1.replace(",", " ") + ", "} </span> </>}
                                                                                    {paddress.address2 && <> <br></br> {paddress.address2.replace(",", " ") + ", "}  </>}
                                                                                    <br></br>
                                                                                    {paddress.landmark && paddress.landmark.replace(",", " ") + ", "}
                                                                                    {paddress.city && paddress.city.replace(",", " ") + ", "}
                                                                                    {paddress.zipcode && paddress.zipcode.replace(",", " ")}
                                                                                    <br></br>
                                                                                    <br></br>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                )
                                                        })
                                                        }

                                                        {/* {businessAddresses && businessAddresses.map((baddress) => {
                                                    <span class="size_20 color_grey">&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;{baddress.address1.replace(",", " ")}{","}
                                                        <br></br> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;{baddress.address2.replace(",", " ")}{","}
                                                        <br></br>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; {baddress.landmark.replace(",", " ")}{","}
                                                        <br></br>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; {baddress.city.replace(",", " ")}{","}
                                                        <br></br>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; {baddress.zipcode.replace(",", " ")}{","}
                                                    </span>
                                                }) 
                                                }*/}
                                                    </div>

                                                    {personalAddresses === null && personalAddresses?.length === 0 &&
                                                        <>
                                                            <div className="col-lg-6 col-sm-6 padding_0_right">
                                                                <GoogleAutoComplete sendToParent={sendToParent} /></div>
                                                            <div className="col-lg-6 col-sm-6 col-xs-12">
                                                                <button type="submit" className="btn-primary submit" ><img src="/images/submit.png" /></button>
                                                            </div>
                                                            {addressdetail?.address1 &&
                                                                <div className="col-lg-12 col-sm-12 col-xs-12">
                                                                    <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pinnew.png" style={{ height: "30px", width: "30px" }} alt="" />
                                                                        &nbsp;&nbsp; {addressdetail?.address1}
                                                                        <br />
                                                                        <span className="size_20 color_grey">
                                                                            &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                            {addressdetail.businessname !== '' && addressdetail?.businessname !== undefined && addressdetail?.businessname + ", "}
                                                                            {addressdetail.address1 !== '' && addressdetail?.address1 !== undefined && addressdetail?.address1 + ", "}
                                                                            {addressdetail.city !== '' && addressdetail.city !== '' && addressdetail.city + ", "}
                                                                            {addressdetail.state !== '' && addressdetail.state !== '' && addressdetail.state + ", "}
                                                                            {addressdetail.country !== '' && addressdetail.country !== '' && addressdetail.country + ", "}
                                                                            {addressdetail.zipcode !== '' && addressdetail.zipcode !== '' && addressdetail.zipcode}
                                                                        </span></h5>
                                                                </div>
                                                            }
                                                        </>
                                                    }

                                                    {personalAddresses && personalAddresses.length > 4
                                                        ?
                                                        <div className="row in">
                                                            {ismore === false &&
                                                                <div className="col-lg-12 text-right">
                                                                    <a onClick={() => handlemoreclick(ismore)} className="expandMoreAddress color_orange">More Addresses</a>
                                                                </div>}
                                                            {ismore === true &&
                                                                <div className="col-lg-12 text-right">
                                                                    <a onClick={() => handlemoreclick(ismore)} className="shrinkAddress color_orange">Less Addresses</a>
                                                                </div>}
                                                        </div>
                                                        :
                                                        <>

                                                        </>
                                                    }
                                                </>
                                                : <>
                                                    <div className="col-lg-12 o-btn col-sm-12 col-xs-12 padding_left_0">
                                                        {/* <GoogleAddress /> */}
                                                        <div className="col-lg-6 col-sm-6 padding_0_right">
                                                            <GoogleAutoComplete sendToParent={sendToParent} /></div>
                                                        <div className="col-lg-6 col-sm-6 col-xs-12">
                                                            <button type="submit" className="btn-primary submit" ><img src="/images/submit.png" /></button>
                                                        </div>

                                                        {addressdetail?.address1 &&
                                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                                <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pinnew.png" style={{ height: "30px", width: "30px" }} alt="" />
                                                                    &nbsp;&nbsp; {addressdetail?.address1}
                                                                    <br />
                                                                    <span className="size_20 color_grey">
                                                                        &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        {addressdetail.address1 !== '' && addressdetail?.address1 !== undefined && addressdetail?.address1 + ", "}
                                                                        {addressdetail.city !== '' && addressdetail.city !== '' && addressdetail.city + ", "}
                                                                        {addressdetail.state !== '' && addressdetail.state !== '' && addressdetail.state + ", "}
                                                                        {addressdetail.country !== '' && addressdetail.country !== '' && addressdetail.country + ", "}
                                                                        {addressdetail.zipcode !== '' && addressdetail.zipcode !== '' && addressdetail.zipcode}
                                                                        {/* {`${addressdetail?.address1 + ", " + addressdetail?.city + ", " + addressdetail?.state + " , " + addressdetail?.zipcode}`} */}
                                                                    </span></h5>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-lg-12 col-sm-12 text-center">
                                                        <span className="or">OR</span>
                                                    </div>
                                                    <div className="col-lg-12 o-btn text-center col-sm-12 col-xs-12">
                                                        <div className="col-lg-3 col-sm-3">
                                                        </div>

                                                        <div className="col-lg-6 col-sm-6">
                                                            <a
                                                                className="orange_side_btn orange_bord_btn margin_10px "
                                                                data-toggle="modal"
                                                                data-target="#myModal-logintest"
                                                                onClick={() => logindetailsclick()}
                                                                style={{ width: "320px" }}
                                                            >     Login    </a>

                                                            {/* <input type="submit" className="orange_btn_submit" onClick={() => logindetailsclick()} value="Login" /> */}

                                                        </div>
                                                        <div className="col-lg-3 col-sm-3">
                                                        </div>

                                                        {/* <Link href="/[dynamic]/register" as={`/${restaurantinfo.restaurantURL}/register`}>
                                                    <a className="orange_side_btn orange_bord_btn margin_10px" >Register</a>
                                                </Link> */}
                                                        <span className="or">OR</span>
                                                    </div>
                                                </>
                                            }

                                        </div>
                                    </div>

                                    <div className="row row-eq-height">
                                        <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                                            <div className="numbers">2</div>
                                        </div>

                                        <div className="col-lg-12 sp-d col-sm-12 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                                    <h3 className='color_black'> Select Location </h3>
                                                </div>
                                            </div>

                                            <div className="row">
                                                {addressList && addressList.map((address, index) => {
                                                    let locationFullAddress = address.locationName + "," + address.address1 + "," + address.cityName + "," + address.zipcode;
                                                    let gmaplink = ENDPOINTS.GOOGLE_MAP_LINK + locationFullAddress;

                                                    return (
                                                        <div className='col-lg-6 col-sm-6' key={index}>
                                                            <a className=""
                                                                onClick={() => handleClick(address.locationId)}>
                                                                <div className={"col-lg-12 col-sm-12  padding_10 margin_top_6 margin_bottom_6 border_radius_20 " + (selectedAddressId > 0 && (address.locationId === selectedAddressId) ? 'full_grey_border_selected' : 'full_grey_border')}
                                                                    style={{ minHeight: "200px" }}
                                                                >
                                                                    <div className="col-lg-12 col-sm-12">
                                                                        <div className="col-lg-2 col-sm-2 margin_top_55">
                                                                            <a href={gmaplink} target="_blank">
                                                                                <img src="/images/pinnew.png" alt="" />
                                                                            </a>

                                                                        </div>
                                                                        <div className="col-lg-10 col-sm-10">
                                                                            <h5 className="size_22 color_black weight_300"> {address.locationName}</h5>
                                                                            <span className="size_20 color_grey ">{address.address1}{","}
                                                                                <br></br> {address.cityName}{","}
                                                                                <br></br> {address.zipcode}</span>
                                                                            <br />
                                                                            <br />
                                                                            {/* <span>{address.ClosingTime !== null && address.ClosingTime[1]}</span> */}
                                                                            {address.isTakeaway === true && <span className="size_20 color_black"> <> Pickup <i className="fa fa-check greenColor" aria-hidden="true"></i></>&nbsp; &nbsp; </span>}
                                                                            {address.isDelivery === true && <span className="size_20 color_black"> <> Delivery <i className="fa fa-check greenColor" aria-hidden="true"></i></> </span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )

                                                })
                                                }
                                                <br /><br />
                                                <div className="col-lg-12 col-sm-12 col-xs-10">
                                                    <br /><br />
                                                    <div className="col-lg-3 text-center col-sm-3 col-xs-12">
                                                    </div>

                                                    <div className="col-lg-6 text-center col-sm-6 col-xs-12">
                                                        {displayNext === false ?
                                                            <a className="blue_btn blue_btn_porder disabled" disabled>Next</a>
                                                            :
                                                            <Link href="/[dynamic]/pickup" as={`/${restaurantinfo.restaurantURL}/pickup`}>
                                                                <a className="blue_btn blue_btn_porder ">Next</a>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-lg-3 text-center col-sm-3 col-xs-12">
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
                </section> :
                <IndexSkeleton />
            }
        </>
    )

}

export default IndexWithLogin;