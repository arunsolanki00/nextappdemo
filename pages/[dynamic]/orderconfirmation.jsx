import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MemoizedHeaderLogoComponent } from "../../components/Header/headerlogo.component";
import Link from 'next/link';

const OrderConfirmation = () => {

    let trid = useSelector(({ cart }) => cart.transactionid);
    let orderinfo=useSelector(({ order }) => order);
    let calculatedTotal=orderinfo?.calculatedTotal;
    let orderId=orderinfo?.orderId;
    let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    // if (trid != undefined && restaurantinfo != undefined)
        return (
            <>
                <section id="pickup" className="checkout">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 visible-xs text-center col-sm-12 col-xs-12">
                                <a href="index.html"><img src="/images/logo-blue.png" alt="" /></a>
                            </div>
                            <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                                {/* <a className="size_24 weight_500 color_grey" href="#">
                                    <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span> Back</a> */}
                            </div>
                            <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                                <MemoizedHeaderLogoComponent />
                                {/* <a href="index.html"><img src="images/logo-blue.png" alt="" /></a> */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12 vh-75">
                                <div className="tablerow">
                                    <div className="tablecell">
                                        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                                            <img src="/images/check-circle-1.svg" />
                                            <h1 className="margin_bottom_30">Thank you!</h1>
                                            <p className="color_000 size_20">Your order has been placed. Please check your email for confirmation.</p>
                                            <p className="size_20">Your order # : <span className="color_orange">{`${orderId}`}</span></p>
                                            {/* <p className="size_20">Your transaction ID : <span className="color_orange">{trid}</span></p> */}
                                            <div className="btnsMore margin_top_30">
                                                <Link href={`/${restaurantinfo.restaurantURL}/pickup`}>
                                                    <a className="blue_btn margin_right_10" style={{minWidth:"228.5px"}}>Go To Home</a>
                                                </Link>
                                                <Link href={`/${restaurantinfo.restaurantURL}`}>
                                                    <a className="blue_btn" style={{minWidth:"228.5px"}}>Start Another Order</a>
                                                </Link>
                                            </div>
                                            <div className="showLove">
                                                <i className="fa fa-heart active size_32 color_red"></i>
                                                <p className="color_000 size_20">Show us some love</p>
                                                {/* <ul className="socialMedia">
                                                    <li><a href="#" className="size_32 color_fb"><i className="fa fa-facebook"></i></a></li>
                                                    <li><a href="#" className="size_36 color_000"><i className="fa fa-instagram"></i></a></li>
                                                </ul> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    // return null;
}

export default OrderConfirmation;