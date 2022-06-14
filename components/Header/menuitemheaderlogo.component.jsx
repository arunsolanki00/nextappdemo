// import logoblue from "../../public/images/logo-blue.png";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";


const MenuItemHeaderLogoComponent=({ restaurantinfo }) =>{
    const restaurantinfodetail = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const { logo, restaurantURL } = !restaurantinfo ? restaurantinfodetail:restaurantinfo;
    return (
        <>
            <div className="col-lg-3 logo-wid hidden-xs hidden-sm text-center col-sm-12 col-xs-12">
                <Link href="/[dynamic]/" as={`/${restaurantURL}/`}>
                    <a>
                        {logo ? (
                            <img src={logo} alt="" width={180} height={100} />
                        ) : ('')}
                    </a>
                </Link>
            </div>
        </>
    )
}

export const MemoizedMenuItemHeaderLogoComponent = React.memo(MenuItemHeaderLogoComponent)