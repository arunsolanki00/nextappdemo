import { useRouter } from "next/router";
import React, { Component, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Common/loader/loader.component";
import { DeliverySkeleton } from "../../components/Common/Skeleton/delivery-skeleton.component";
// import { DeliverySkeleton } from "../../components/Common/Skeleton/delivery-skeleton.component";
import Deliverywithlogin from "../../components/deliveryoption/deliverywithlogin.component";
import Deliverywithoutlogin from "../../components/deliveryoption/deliverywithoutlogin.component";
import { emptyordertime } from "../../redux/order/order.action";
import { setpickupordelivery } from "../../redux/selected-delivery-data/selecteddelivery.action";


const Delivery2 = () => {
    /*const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);*/
    // const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const router = useRouter();
    const dispatch = useDispatch();
    const { query: { dynamic, id, category, items } } = router;
    const [deliveryCloseMessage, setDeliveryCloseMessage] = useState();
    const [loadingsate, setloadingsate] = useState(false)

    useEffect(() => {
        setloadingsate(true)
        const timer = setTimeout(() => {
        if (defaultLocation) {
            if (!defaultLocation.isdelivery) {
                setDeliveryCloseMessage('Sorry! Delivery is not available. Please try again next time.');
                router.push("/" + restaurantinfo.restaurantURL+"/pickup");
            }
        }
        setloadingsate(false);
        dispatch(setpickupordelivery('Delivery'));
        dispatch(emptyordertime());
    }, 1000);
    return () => clearTimeout(timer);
    }, [])

    // if (userinfo === undefined || userinfo === null && !loadingsate )
    //     return (
        
    //         <Deliverywithoutlogin />
    //     )
    //  if (userinfo != null && userinfo != undefined  && !loadingsate)
        // return (
        //     <Deliverywithlogin />
        // )
    if(!loadingsate){
        return (
            <Deliverywithlogin />
        )
    }
    else {
        return (
           <DeliverySkeleton/>
        )
    }
 
}

export default Delivery2;