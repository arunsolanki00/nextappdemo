import React from 'react'
import OrderDetailComponent from '../../../components/order-detail/order-detail.component';
import Head from "next/head"
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { MemoizedCartCounterComponent } from "../../../components/Header/cart-counter.component";
import DeliveryDropdownComponent from "../../../components/Header/delivery-dropdown.component";
import { MemoizedHeaderLogoComponent } from "../../../components/Header/headerlogo.component";
import LeftMenuComponent from "../../../components/LeftMenu/leftmenu.component";
import Link from "next/link";
import { useRouter } from 'next/router';

const OrderDetail = (props) => {


    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const router = useRouter();
    const { query: { dynamic, index, orderId }, } = router;

    return (
        <>
            <Head>
                <title>{restaurantinfo.restaurantname}: Online Ordering {dynamic}</title>
            </Head>
            <section id="main">
                <div className="container-fluid">
                    <div className="row row-eq-height">
                        <LeftMenuComponent />
                        <div className="col-lg-9 pull-right right-content col-sm-9 col-xs-12">
                            <div className="row">
                                <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                                    <MemoizedHeaderLogoComponent />
                                    <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                                        <DeliveryDropdownComponent />
                                        <MemoizedCartCounterComponent />
                                    </div>
                                </div>
                            </div>
                            <OrderDetailComponent orderId={orderId} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default OrderDetail
