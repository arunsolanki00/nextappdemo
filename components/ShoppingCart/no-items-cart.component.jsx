import React from 'react'
import Link from "next/link";
import  { useRouter }  from 'next/router';
function NoItemsCartComponent(props) {
    const router = useRouter();
    const { query: { dynamic,location ,id, category, items } } = router;
    return (
        <div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                <div className="cart-box col-lg-7 column-centered col-sm-12 col-xs-12 noitemsCart">
                    <div className="col-lg-12 bd margin_top_60 margin_bottom_40 text-center col-sm-12 col-xs-12">
                        <div className="col-lg-12 img text-center col-sm-12 col-xs-12">
                            <i
                                className="fa fa-shopping-basket color_orange"
                                aria-hidden="true"
                            ></i>
                        </div>
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                            <h1 className="margin_top_25">
                                No Items in Your {props.text}
                            </h1>
                            <p className="margin_bottom_25">
                                Add items to it now.
                            </p>
                        </div>
                        <div className="col-lg-12 margin_bottom_25 text-center col-sm-12 col-xs-12">
                            <Link
                                href="/[dynamic]/[location]/main"
                                as={`/${props.restaurantinfo.restaurantURL}/${location}/main`}>
                                <a className="blue_btn size_18">Shop Now</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoItemsCartComponent
