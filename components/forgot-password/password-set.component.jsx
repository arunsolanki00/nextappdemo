import React, { Component, useState } from "react";
import Link from 'next/link';
import { MemoizedRegisterHeaderLogoComponent } from "../Header/registerheaderlogo.component";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function PasswordSetForm() {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const router = useRouter();
    const { query: { dynamic }, } = router;

    const handleContinue=()=>{
        router.push("/" + dynamic );
    }
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
                                            <h2>Your New Password is Set!</h2>
                                            <p>Your new password has been successfully updated in our system. Click continue to proceed to sign in.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 register flush column-centered col-sm-12 col-xs-12">
                                            <div className="col-lg-12 text-center flush col-sm-12 col-xs-12">
                                                <div className="col-lg-12 flush column-centered col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-sm-12 col-xs-12">
                                                        <button className="blue_btn font_18px blue_btn_porder orange_submit" onClick={handleContinue}>Continue</button>
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

export default PasswordSetForm;