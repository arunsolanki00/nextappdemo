import React from 'react'
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

import MenuCategoryWrapperNew from '../../../components/MenucategoryNew/menucategorywrapper-new.component'
import LeftMenuComponent from '../../../components/LeftMenu/leftmenu.component';
import { MemoizedMenuItemHeaderLogoComponent } from '../../../components/Header/menuitemheaderlogo.component';
import DeliveryDropdownComponent from '../../../components/Header/delivery-dropdown.component';
import { MemoizedCartCounterComponent } from '../../../components/Header/cart-counter.component';
import { shallowEqual, useSelector } from 'react-redux';
import MenuItemIntroComponentNew from '../../../components/MenucategoryNew/menuitemintro-new.component';
import MenuCategoryCart from '../../../components/MenucategoryNew/menucategory-cart';

const DynamicCategoryNew = () => {
    const router = useRouter();
    const {
        query: { dynamic, id, category, index },
    } = router;
    const restaurantinfo = useSelector(
        ({ restaurant }) => restaurant.restaurantdetail,
        shallowEqual
    );
    const userinfo = useSelector(
        ({ userdetail }) => userdetail.loggedinuser,
        shallowEqual
    );

    return (
        <>
            <Head>
                <title>
                    {restaurantinfo.restaurantname}: Online Ordering {index}
                </title>
                <description>
                    {restaurantinfo.restaurantname}: Online Ordering{" "}
                </description>
            </Head>
            <section id="main">
                <div className="container-fluid">
                    <div className="row row-eq-height">
                        <LeftMenuComponent />
                        {/* <div className="col-lg-9 pull-right right-content col-sm-9 col-xs-12"> */}
                        <div className="col-lg-11 pull-right s-c right-content col-sm-9 col-xs-12">
                            <div className="row">
                                <div className="col-lg-12 pull-right flush xsnoflush col-sm-12 col-xs-12">
                                    <div className="col-lg-4 left-a col-sm-12 col-xs-12">
                                        <Link
                                            shallow={false}
                                            key={Math.random()}
                                            href="/[dynamic]/main"
                                            as={`/${dynamic}/main`}
                                        >
                                            <a className="size_24 weight_500 color_grey">
                                                <span className="bg_grey">
                                                    <img src="/images/arrow-left.svg" />
                                                </span>{" "}
                                                Back
                                            </a>
                                        </Link>
                                    </div>

                                    <MemoizedMenuItemHeaderLogoComponent />
                                    <div className="col-lg-5 flush xsnoflush small-text-center col-sm-12 col-xs-12">
                                        <DeliveryDropdownComponent />
                                        <MemoizedCartCounterComponent />
                                    </div>
                                </div>
                            </div>
                            {/* <MenuCategoryWrapper /> */}

                            <div className="row eq_none_medium row-eq-height">
                                <MenuCategoryWrapperNew />

                                
                                {/* <MenuItemIntroComponentNew /> */}

                                <MenuCategoryCart />
                                
                            </div>


                        </div>
                    </div>
                </div>
            </section>




        </>
    )
}

export default DynamicCategoryNew