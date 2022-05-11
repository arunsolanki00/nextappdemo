import { useRouter } from "next/router";
import React, { Component, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import LoginMainComponent from "../login/login.component";
import { MemoizedHeaderLogoComponent } from "../Header/headerlogo.component";
import GoogleAddress from "../Common/Address/google-address.component";
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from "../helpers/static-message/pickupconfirmation2-message";
import { GoogleAutoComplete } from "../Common/google.map.component";
import { AddTempDeliveryAddress } from "../../redux/delivery-address/delivery-address.action";

const Deliverywithoutlogin = () => {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const tempDeliveryAddress = useSelector(({ deliveryaddress }) => deliveryaddress.tempDeliveryAddress);

    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const isTakeOutAsap = defaultLocation?.isTakeOutAsap;
    const isTakeOutPickupTime = defaultLocation?.isTakeOutPickupTime;

    const [showLogin, setShowLogin] = useState(false);
    const [addressdetail, setaddressdetail] = useState({ address1: '', city: '', state: '', country: '', zipcode: '', latitude: '', longitude: '' });
    const dispatch = useDispatch();

    useEffect(() => {
        setaddressdetail(tempDeliveryAddress);
    }, []);

    const logindetailsclick = () => {
        setShowLogin(true);
    }

    const sendToParent = (index) => {
         
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

        // console.log(index);
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
    return (
        <>
            <section id="pickup" className="checkout">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                            {/* <Link href="/[dynamic]" as={`/${restaurantinfo.restaurantURL}`}>
                                <a className="size_24 weight_500 color_grey">
                                    <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span> Back
                                </a>
                            </Link> */}
                        </div>
                        <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                            <MemoizedHeaderLogoComponent />
                            {/* <a href="index.html"><img src="/images/logo-blue.png" alt="" /></a> */}
                        </div>
                        <div className="col-lg-12 flush col-sm-12 col-xs-12">
                            <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                <h1 className="margin_bottom_30">Delivery</h1>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                            {(isTakeOutAsap || isTakeOutPickupTime) &&
                                <Link href="/[dynamic]/pickup" as={`/${restaurantinfo.restaurantURL}/pickup`}>
                                    <a className="">
                                        <span>
                                            <img className="white" src="/images/icon-1-white.svg" alt="" />
                                            <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                    </a>
                                </Link>
                            }
                            <a className="active">
                                <span>
                                    <img className="white" src="/images/icon-2-white.svg" alt="" />
                                    <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                            </a>

                        </div>
                        <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
                            <div className="col-lg-10 flush column-centered col-sm-12 col-xs-12">
                                <div className="col-lg-1 col-sm-1 col-xs-12 small-text-center">
                                    <div className="numbers">1</div>
                                </div>
                                <div className="col-lg-11 flush col-sm-11 col-xs-12">
                                    <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                        <h3>Delivery address</h3>
                                    </div>
                                    {/* <div className="col-lg-12 o-btn text-center col-sm-12 col-xs-12">
                                        <a
                                            className="orange_side_btn orange_bord_btn margin_10px"
                                            data-toggle="modal"
                                            data-target="#myModal-logintest"
                                            onClick={() => logindetailsclick()}
                                        >Login</a>
                                        <Link href="/[dynamic]/register" as={`/${restaurantinfo.restaurantURL}/register`}>
                                            <a className="orange_side_btn orange_bord_btn margin_10px" >Register</a>
                                        </Link>
                                        <span className="or">OR</span>
                                    </div> */}
                                    {/* <form className="customForm"> */}

                                    {/* <GoogleAddress />
                                    <div className="col-lg-2 col-sm-2 col-xs-12">
                                        <button type="submit" className="btn-primary submit"><img src="/images/submit.png" alt="" /></button>
                                    </div> */}
                                    {/* </form> */}


                                    <div className="col-lg-12 o-btn col-sm-12 col-xs-12 padding_left_0">
                                        {/* <GoogleAddress /> */}
                                        <div className="col-lg-10 col-sm-10 padding_0_right">
                                            <GoogleAutoComplete sendToParent={sendToParent} /></div>
                                        <div className="col-lg-2 col-sm-2 col-xs-12">
                                            <button type="submit" className="btn-primary submit" ><img src="/images/submit.png" /></button>
                                        </div>

                                        {addressdetail?.address1 &&
                                            <div className="col-lg-12 col-sm-12 col-xs-12">
                                                <h5 className="size_22 color_black weight_300 margin_bottom_20"><img src="/images/pin.png" alt="" />
                                                    &nbsp;&nbsp; {addressdetail?.address1}
                                                    <br />
                                                    <span className="size_20 color_grey">
                                                        &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                                                        {addressdetail.address1 !== '' && addressdetail?.address1 !== undefined && addressdetail?.address1 + ", "}
                                                        {addressdetail.city !== '' && addressdetail.city !== '' && addressdetail.city + ", "}
                                                        {addressdetail.state !== '' && addressdetail.state !== '' && addressdetail.state + ", "}
                                                        {addressdetail.zipcode !== '' && addressdetail.zipcode !== '' && addressdetail.zipcode}
                                                        {/* {`${addressdetail?.address1 + ", " + addressdetail?.city + ", " + addressdetail?.state + " , " + addressdetail?.zipcode}`} */}
                                                    </span></h5>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-lg-12 text-center col-sm-12 ">
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
                                        </div>
                                        <div className="col-lg-3 col-sm-3">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
        </>
    )
}

export default Deliverywithoutlogin;