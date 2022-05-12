// import logoblue from "../../public/images/logo-blue.png";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";


const RegisterHeaderLogoComponent =({ restaurantinfo }) =>{

    const restaurantinfodetail = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const { logo, restaurantURL } = !restaurantinfo ? restaurantinfodetail:restaurantinfo;

    return (
        <>
            <div className="col-lg-8 hidden-xs text-center col-sm-4 col-xs-6">
                <Link href="/[dynamic]/" as={`/${restaurantURL}/`}>
                    <a>
                        {logo ? (
                            // <Image src={logo}
                            //     alt="Picture of the author"
                            //     width={180}
                            //     height={100} ></Image>
                            <img src={logo} alt="" width={180} height={100} />
                        ) : ('')}
                        {/* <img src={logo} alt="" height="100" width="180" /> */}
                        {/* <img src="/images/logo-blue.png" alt="" /> */}
                    </a>
                </Link>
            </div>
        </>
    )
}

export const MemoizedRegisterHeaderLogoComponent = React.memo(RegisterHeaderLogoComponent)