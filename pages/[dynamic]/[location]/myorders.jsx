import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector, shallowEqual } from "react-redux";
import LeftMenuComponent from "../../../components/LeftMenu/leftmenu.component";
import { MemoizedCartCounterComponent } from "../../../components/Header/cart-counter.component";
import DeliveryDropdownComponent from "../../../components/Header/delivery-dropdown.component";
import { MemoizedHeaderLogoComponent } from "../../../components/Header/headerlogo.component";
import MyOrdersComponent from "../../../components/myorders/myorders.component";

const MyOrders = () => {
  const restaurant = useSelector(
    ({ restaurant }) => restaurant.restaurantdetail,
    shallowEqual
  );
  return (
    <>
      <Head>
        <title>{restaurant.restaurantname}: Online Ordering</title>
        <meta name="description" content="Online description" />
      </Head>
      <div className="container-fluid">
        <div className="row row-eq-height">
          <LeftMenuComponent />
          <div className="col-lg-9 pull-right right-content col-sm-9 col-xs-12">
            <div className="row">
              <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                <MemoizedHeaderLogoComponent restaurantinfo={restaurant} />
                <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                  <DeliveryDropdownComponent />
                  <MemoizedCartCounterComponent />
                </div>
              </div>
              <div className="col-lg-12 h1-margin pull-right flush xsnoflush col-sm-12 col-xs-12">
                <h1>My orders</h1>
              </div>
            </div>
            <MyOrdersComponent restaurantinfo={restaurant} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
