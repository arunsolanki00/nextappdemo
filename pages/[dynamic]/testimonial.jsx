import React, { useState, useEffect } from "react";
import Head from "next/head";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import LeftMenuComponent from "../../components/LeftMenu/leftmenu.component";
import { MemoizedCartCounterComponent } from "../../components/Header/cart-counter.component";
import DeliveryDropdownComponent from "../../components/Header/delivery-dropdown.component";
import { MemoizedHeaderLogoComponent } from "../../components/Header/headerlogo.component";
import TestimonialListComponent from "../../components/testimonial/testimonial-list.component";
import TestimonialAddComponent from "../../components/testimonial/testimonial-add.component";

const Testimonial = () => {
  const restaurantinfo = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );

  const [count, setcount] = useState(0);

  const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
  const customerId = userinfo ? userinfo.customerId : 0;

  const restaurantId = restaurantinfo.restaurantId;
  const locationId = restaurantinfo.defaultlocationId;

  function updateList(){
    console.log("set count");
    setcount(count+1);
    console.log("set count"+ count);
  }

  return (
    <>
      <Head>
        <title>{restaurantinfo.restaurantname}: Online Ordering</title>
        <meta name="description" content="Online description" />
      </Head>
      <div className="container-fluid">
        <div className="row row-eq-height">
          <LeftMenuComponent />
          <div className="col-lg-11 pull-right cart right-content account col-sm-11 col-xs-12">
            <div className="row">
              <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                <MemoizedHeaderLogoComponent restaurantinfo={restaurantinfo} />
                <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                  <DeliveryDropdownComponent />
                  <MemoizedCartCounterComponent />
                </div>
              </div>
              <div className="col-lg-12 h1-margin pull-right flush xsnoflush col-sm-12 col-xs-12">
                <h1 className="margin_top_0px">Testimonials</h1>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 pull-right pizza-in col-sm-12 col-xs-12">
              <TestimonialAddComponent restaurantId={restaurantId} locationId={locationId} customerId={customerId} updateList={updateList} />
              <TestimonialListComponent restaurantId={restaurantId} count={count}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
