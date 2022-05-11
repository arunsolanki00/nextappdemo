import { useState } from "react";
import { useSelector } from "react-redux";

function PickupDropdawnComponent() {
    let objrestaurant = useSelector(({ restaurant }) => restaurant.restaurantdetail);

    return (
      <>
            <div className="col-lg-9 small-text-right flush text-right dele col-sm-9 col-xs-10">
                <div className="dropdown">
                        <>
                            <h6 className="margin_0">Delivery</h6>
                        </>
                        <>
                              <a className="color_grey d-inline-block size_20">
                              <>{`${objrestaurant && objrestaurant.defaultLocation.address1},  ${objrestaurant && objrestaurant.defaultLocation.cityname}`}</>
                                <i className="fa size_32 color_green margin_left_5 top_-1 position_relative d-inline-block v-middle fa-angle-right"></i>
                            </a>
                         </>
             
                </div>
            </div>
        </>
    )
}

export default PickupDropdawnComponent
