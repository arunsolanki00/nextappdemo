import React from 'react';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCartItemCount } from "../../redux/cart/cart.action";
// import { getSessionKey } from "../Common/auth";
import LoginMainComponent from '../login/login.component';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { createSessionId } from '../../redux/session/session.action';
function CartCounterComponent() {
    const dispatch = useDispatch();
    const router = useRouter();
    let objrestaurant = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const customerId = userinfo ? userinfo.customerId : 0;
    // let session=useSelector(({session})=>session)
    // let sessionid=session?.sessionid;
    let sessionid = useSelector(({ session }) => session?.sessionid);
    console.log("init",sessionid)
    const { restaurantURL } = objrestaurant;
    // let cartsessionId = getSessionKey(objrestaurant.restaurantId, customerId,objrestaurant.defaultlocationId);
    let cartcount = useSelector(({ cart }) => cart.cartitemcount);
    const [showLogin, setShowLogin] = useState(false);

    const cartdetailsclick = () => {
        if (userinfo === undefined || userinfo === null) {
            setShowLogin(true);
        }
        else {
            setShowLogin(false);
        }
    }

    useEffect(() => {
        
        console.log("shpcount session id",sessionid)
        if(sessionid!==null){
            // sessionid=uuidv4();
            // dispatch(createSessionId(sessionid))
            dispatch(getCartItemCount(sessionid, objrestaurant.defaultlocationId, objrestaurant.restaurantId, customerId));
        }
    }, [ userinfo]);
    return (
        <>
            <div className="col-lg-3 col-sm-3 col-xs-2">
                {/* {(userinfo != undefined && userinfo != null) && */}
                    <Link href="/[dynamic]/cartitems" as={`/${restaurantURL}/cartitems`}>
                        <a className="cart">
                            <img src="/images/cart.svg" alt="" /><em>{cartcount}</em>
                        </a>
                    </Link>
                    {/* <Link href="/[dynamic]/cart-login" as={`/${restaurantURL}/cart-login`}>
                        <a className="cart">
                            <img src="/images/cart.svg" alt="" /><em>{cartcount}</em>
                        </a>
                    </Link> */}
                {/* {(userinfo === undefined || userinfo === null) &&
                    <a className="cart"
                        onClick={() => cartdetailsclick()}
                        data-toggle="modal"
                        data-target="#myModal-logintest"
                    >
                        <img src="/images/cart.svg" alt="" /><em>
                            {userinfo != undefined && userinfo != null ? cartcount : 0}
                        </em>
                    </a>
                } */}
            </div>
            {showLogin === true && <LoginMainComponent restaurantinfo={objrestaurant} />}
        </>
    )

}

//export default CartCounterComponent
export const MemoizedCartCounterComponent = React.memo(CartCounterComponent)
