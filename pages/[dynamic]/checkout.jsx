import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { MemoizedHeaderLogoComponent } from '../../components/Header/headerlogo.component'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import RestaurantInfoComponent from "../../components/pickup/restaurant-info.component";
import CalenderTimeComponent from "../../components/Common/calender-time.component";
import Link from 'next/link';
import CheckoutForm from "../../components/checkout/checkout-form.component";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { CartServices } from "../../redux/cart/cart.services";
import stripepaymentintentid from '../../redux/cart/cart.action'
import { CartTypes } from "../../redux/cart/cart.types";
import StripeCheckoutComponent from "../../components/checkout/stripe-checkout.component";

// const stripePromise = loadStripe("pk_test_0bKCpEeD8pBkxBspkPe0uX8800lh61abUd");

const stripePromise = loadStripe(process.env.STRIPE_SANDBOX_PUBLISH_API_KEY);
//let stripekey = process.env.STRIPE_LIVE_PUBLISH_API_KEY;

const Checkout = () => {

    const router = useRouter();
    const dispatch = useDispatch();
     
    const { query: { dynamic, id, category, items } } = router;

    // let orderinfo = useSelector(({ cart }) => cart?.orderinfo);
    // let calculatedTotal =orderinfo && orderinfo?.calculatedTotal;
    // let order = useSelector(({ order }) => cart?.calculatedTotal);

    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const order = useSelector(({ order }) => order, shallowEqual);
    const calculatedTotal =order && order?.calculatedTotal;
    const [isenable, setisenable] = useState(false)
    const selecteddelivery = useSelector(({ selecteddelivery }) => selecteddelivery);
    const location = restaurantinfo.defaultLocation;
    const ordertype = selecteddelivery.pickupordelivery === "Pickup" ? 1 : 2;
    const [redirectpage, setredirectpage] = useState(ordertype && ordertype==1 ? 'pickupconfirmation' : ordertype== 2 ? 'deliveryconfirmation':'')
    const pagehref=`/[dynamic]/${ordertype && ordertype==1 ? 'pickupconfirmation' : ordertype== 2 ? 'deliveryconfirmation':''}`;

    useEffect(() => {
        if(restaurantinfo && location && location.isOrderingDisable == true) {
            router.push("/" + restaurantinfo.restaurantURL + "/restaurant-close");
          }

          if (order === undefined || order.isRedirectToCheckout === false) {
            if (ordertype === 1)
                return router.push("/" + restaurantinfo.restaurantURL + "/pickupconfirmation");
            if (ordertype === 2)
                return router.push("/" + restaurantinfo.restaurantURL + "/deliveryconfirmation");
        }
        }, []);
  const changeClickCheckout=()=>{
    setisenable(true);
  }
    if (userinfo != undefined && userinfo != null)
        return (
            <>
                <Elements stripe={stripePromise}>
                    <section id="pickup" className="checkout">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
                                </div>
                                <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                                    <Link
                                        shallow={false}
                                        key={Math.random()} href={pagehref}
                                        as={`/${dynamic}/${redirectpage}`}>
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
                                <div className="col-lg-2 text-right  flush col-sm-4 col-xs-6">
                                    <div className="col-lg-12 rt-total col-sm-12 col-xs-12" style={{ marginTop: 11 }}>
                                        <span className="color_grey size_24">Total: <span className="price size_24 bgg_orange color_white">$ {calculatedTotal && calculatedTotal > 0 ? calculatedTotal.toFixed(2): 0 }</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                                    <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                        <h1 className="margin_bottom_30">Payment</h1>
                                    </div>
                                </div>
                                <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a data-toggle="tab" href="#checkout-tab-3">
                                            <span>
                                                <i className="fa fa-credit-card"></i></span>Pay by<br /> Card</a></li>
                                    </ul>
                                </div>
                                <div className="col-lg-12 tp flush col-sm-12 col-xs-12">
                                    <div className="tab-content">
                                        <div id="checkout-tab-3" className="tab-pane fade in active">
                                            <div className="col-lg-11 column-centered col-sm-12 col-xs-12">
                                                <div className="row row-eq-height">
                                                    <div className="col-lg-1 hide text-center col-sm-1 col-xs-12">
                                                        <div className="numbers">1</div>
                                                        <div className="line"></div>
                                                    </div>
                                                    <div className="col-lg-12 sp-d col-sm-12 col-xs-12">
                                                        <div className="row">
                                                            <div className="col-lg-8 column-centered flush col-sm-10 col-xs-12">

                                                                {/* <CheckoutForm /> */}
                                                               {
                                                                   ((calculatedTotal && calculatedTotal > 0 ) || isenable=== true) &&
                                                                   <StripeCheckoutComponent orderId={order.orderId} calculatedTotal={calculatedTotal} changeOnCheckout={changeClickCheckout}/>
                                                               }
                                                                   {/* <StripeCheckoutComponent orderId={order.orderId} calculatedTotal={calculatedTotal}/> */}

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
                </Elements>
            </>
        )
    else if (location.isOrderingDisable === false)
        return (<> </>);

    else if (userinfo === undefined || userinfo === null)
        return (window.open(`/${restaurantinfo.restaurantURL}/`, '_self'));
}

export default Checkout;