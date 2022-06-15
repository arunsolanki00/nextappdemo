import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selecteddeliveryaddress, setpickupordelivery } from '../../redux/selected-delivery-data/selecteddelivery.action';
import { DeliveryConfirmationMessage, PickUpConfirmationMessage } from '../helpers/static-message/pickupconfirmation2-message'

export const DeliveryPickupButton = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        query: { dynamic,location },
    } = router;
    const { page } = props;
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const defaultLocation = restaurantinfo ? restaurantinfo.defaultLocation : null;
    const isTakeOutAsap = defaultLocation.isTakeOutAsap;
    const isTakeOutPickupTime = defaultLocation.isTakeOutPickupTime;
    const isDeliveryPickupTime = defaultLocation.isDeliveryPickupTime;
    const isDeliveryAsap = defaultLocation.isDeliveryAsap;
    const restaurantWindowTime = useSelector(({ main }) => main.restaurantWindowTime);
    const pickupWindow = (restaurantWindowTime && restaurantWindowTime.pickupTime) && restaurantWindowTime.pickupTime;
    const deliveryWindow = (restaurantWindowTime && restaurantWindowTime.deliveryTime) && restaurantWindowTime.deliveryTime;
    const handleClickDelivery = () => {
        // if(page === "pickup"){
        //     router.push("/" + dynamic + "/delivery");
        //     return;
        //  }
        dispatch(setpickupordelivery('Delivery'));
        router.push("/" + dynamic+"/"+location + "/deliveryconfirmation");
    }
    const handleClickPickup = () => {
        //  if(page === "delivery"){
        //     router.push("/" + dynamic + "/pickup");
        //     return;
        //  }
        dispatch(setpickupordelivery('Pickup'));
        dispatch(selecteddeliveryaddress(null))
        router.push("/" + dynamic+"/"+location + "/pickupconfirmation");
    }
    return (
        <div className="col-lg-12 btns text-center col-sm-12 col-xs-12">
            {
                (page === "pickupconfirmation" || page === "pickup") ?
                    <>
                        <a className="active" >
                            <span>
                                <img className="white" src="/images/icon-1-white.svg" alt="" />
                                <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                        </a>
                        {(isDeliveryPickupTime || isDeliveryAsap) &&
                            <>
                                {defaultLocation.isdelivery === true && deliveryWindow && deliveryWindow.length > 0 ?
                                    <a className="" onClick={handleClickDelivery}>
                                        <span>
                                            <img className="white" src="/images/icon-2-white.svg" alt="" />
                                            <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                    </a>
                                    :
                                    <a className="" style={{ backgroundColor: "lightgrey" }}>
                                        <span>
                                            <img className="white" src="/images/icon-2-orange.PNG" alt="" />
                                            <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                                    </a>
                                }
                            </>
                        }
                    </>

                    :
                    <>
                        {
                            (isTakeOutAsap || isTakeOutPickupTime) &&
                            <>
                                {defaultLocation.istakeaway === true && pickupWindow && pickupWindow.length > 0 ?
                                    // <Link href="/[dynamic]/pickup" as={`/${restaurantinfo.restaurantURL}/pickup`}>
                                    <a className="" onClick={handleClickPickup}>
                                        <span>
                                            <img className="white" src="/images/icon-1-white.svg" alt="" />
                                            <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                    </a>
                                    // </Link>
                                    :
                                    <a className="" style={{ backgroundColor: "lightgrey" }}>
                                        <span>
                                            <img className="white" src="/images/icon-1-orange.svg" alt="" />
                                            <img className="orange" src="/images/icon-1-orange.svg" alt="" /></span>{PickUpConfirmationMessage.PICKUP}
                                    </a>
                                }
                            </>
                        }
                        <a className="active">
                            <span>
                                <img className="white" src="/images/icon-2-white.svg" alt="" />
                                <img className="orange" src="/images/icon-2-orange.PNG" alt="" /></span>{DeliveryConfirmationMessage.DELIVERY}
                        </a>
                    </>
            }
        </div>
    )

   
}
