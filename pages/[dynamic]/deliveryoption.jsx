import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import RestaurantInfoComponent from "../../components/pickup/restaurant-info.component";
import { MemoizedRegisterHeaderLogoComponent } from "../../components/Header/registerheaderlogo.component";
import CalenderTimeComponent from "../../components/Common/calender-time.component";
import { LocationServices } from "../../redux/location/location.services";
import { LocationTypes } from "../../redux/location/location.types";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import LoginMainComponent from "../../components/login/login.component";
import Link from "next/link"
import { useRouter } from 'next/router';

const DeliveryOption = ({ restaurant }) => {
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );

  const timminginfo = useSelector(
    ({ todaytimming }) => todaytimming,
    shallowEqual
  );

  const router = useRouter();
  const { query: { dynamic }, } = router;

  const [timepopup, settimepopup] = useState(false);
  const handleTimePopup = () => settimepopup(true);
  const [showLogin, setShowLogin] = useState(false);

  const selectTime = (locationId) => { };

  const handleLogin = () => setShowLogin(true);

  return (
    <>
      <section id="pickup" className="checkout">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
              <a href="index.html">
                <img src="/images/logo-blue.png" />
              </a>
            </div>
            <div className="col-lg-2 left-a col-sm-4 col-xs-6">
              <a className="size_24 weight_500 color_grey">
                <span className="bg_grey">
                  <img src="/images/arrow-left.svg" />
                </span>{" "}
                Back
              </a>
            </div>
            <MemoizedRegisterHeaderLogoComponent />
            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
              <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                <h1 className="margin_bottom_30">Pickup</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 flush xsnoflush col-sm-12 col-xs-12">
              <div className="col-lg-10 column-centered col-sm-12 col-xs-12">
                <div className="row row-eq-height">
                  <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                    <div className="numbers">1</div>
                    <div className="line" />
                  </div>
                  <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                        <h3>Select your address</h3>
                        <form className="customForm hide">
                          <div className="col-lg-12 flush-left col-sm-12 col-xs-12">
                            <input
                              className="search input-black"
                              type="text"
                              placeholder="900 Eglinton Ave W, New York"
                              required
                            />
                            <label className="formlabel search">Address</label>
                          </div>
                        </form>
                      </div>
                    </div>
                    {restaurantinfo !== null && (
                      <RestaurantInfoComponent
                        restaurantinfo={restaurantinfo}
                        timminginfo={timminginfo.timming}
                      />
                    )}
                  </div>
                </div>
                <div className="row row-eq-height">
                  <div className="col-lg-1 text-center flush col-sm-1 col-xs-12">
                    <div className="numbers">2</div>
                  </div>
                  <div className="col-lg-11 sp-d col-sm-11 col-xs-12">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                        <h3>Pickup time</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-8 column-centered flush col-sm-12 col-xs-10">
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <a className="grey_btn active">Now</a>
                        </div>
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <a
                            className="grey_btn"
                            data-toggle="modal"
                            data-target="#myModal-timer"
                            onClick={handleTimePopup}
                          >
                            Later On
                          </a>
                        </div>
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <a className="grey_btn" href="#">
                            Future Date
                          </a>
                        </div>
                        <div className="col-lg-12 dd text-center col-sm-12 col-xs-12">
                          <h5 className="color_black">Today at 6:25 PM</h5>
                        </div>
                      </div>
                      <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                        <a className="active" href="pickup.html">
                          <span>
                            <img
                              className="white"
                              src="/images/icon-1-white.svg"
                              alt
                            />
                            <img
                              className="orange"
                              src="/images/icon-1-orange.svg"
                              alt
                            />
                          </span>
                          Pickup
                        </a>
                        <a className href="delivery.html">
                          <span>
                            <img
                              className="white"
                              src="/images/icon-2-white.svg"
                              alt
                            />
                            <img
                              className="orange"
                              src="/images/icon-2-orange.PNG"
                              alt
                            />
                          </span>
                          Delivery
                        </a>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-8 margin_top_30 column-centered flush col-sm-12 col-xs-10">
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <a
                            className="orange_side_btn orange_bord_btn margin_10px"
                            onClick={handleLogin}
                            data-toggle="modal"
                            data-target="#myModal-logintest"
                          > Login </a>
                        </div>
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          <a className="orange_side_btn orange_bord_btn">
                            Register
                          </a>
                        </div>
                        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
                          {/* <a className="blue_btn skipbtn active">Skip</a> */}
                          <Link
                            shallow={false}
                            href="/[dynamic]"
                            as={`/${dynamic}`}>
                            <a className="blue_btn skipbtn active">
                              Skip
                                </a>
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
        {timepopup === true && <CalenderTimeComponent />}

        {showLogin === true && <LoginMainComponent restaurantinfo={restaurantinfo} />}
      </section>
    </>
  );
};

export default DeliveryOption;
