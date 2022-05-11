import React, { Component, useState } from "react";
import Link from 'next/link';
import { MemoizedRegisterHeaderLogoComponent } from "../Header/registerheaderlogo.component";
import { useSelector } from "react-redux";

function ResetFailedForm() {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    return (
        <>
            <section id="pickup" className="cre-password">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 left-a col-sm-4 col-xs-6">
                            <Link href="/[dynamic]" as={`/${restaurantinfo.restaurantURL}`}>
                                <a className="size_24 weight_500 color_grey">
                                    <span className="bg_grey"><img src="/images/arrow-left.svg" alt="" /></span>Back
                                </a>
                            </Link>
                        </div>
                        <MemoizedRegisterHeaderLogoComponent />
                    </div>
                    <div className="row">
                        <div className="col-lg-12 tp-pickup flush col-sm-12 col-xs-12">
                        </div>
                        <div className="col-lg-12 flush col-sm-12 col-xs-12">
                            <div className="col-lg-5 column-centered col-sm-8 col-xs-12">
                                <div className="col-lg-12 bg-s pa-set col-sm-12 col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-12 col-sm-12 col-xs-12">
                                            <h2>Password Reset Failed</h2>
                                            <p>We're sorry, but the link you clicked appears to be invalid.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 register flush column-centered col-sm-12 col-xs-12">
                                            <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                                                <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                                        <Link href="/[dynamic]" as={`/${restaurantinfo.restaurantURL}`}>
                                                            <button className="blue_btn font_18px blue_btn_porder orange_submit">Continue</button>
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
        </>
    )
}

export default ResetFailedForm;