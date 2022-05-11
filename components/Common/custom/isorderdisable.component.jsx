import React from "react";
import {  useSelector, shallowEqual } from "react-redux";
export const IsOrderDisable = (props) => {
   
    const {buttonname,loginclick,buttonclick}=props;
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const restaurantinfo = useSelector(
        ({ restaurant }) => restaurant.restaurantdetail
      );
      const location = restaurantinfo.defaultLocation;
    const deliveryaddressinfo = useSelector(
        ({ selecteddelivery }) => selecteddelivery
      );
      if (location && location.isOrderingDisable == true) {
        return (
          <h5 className="size_22 color_red weight_300 margin_bottom_20" style={{textAlign:"center"}}>
            {" "}
            {location.orderingMessage && location.orderingMessage}{" "}
          </h5>
        );
      } else {
        if (
          deliveryaddressinfo &&
          deliveryaddressinfo.pickupordelivery === "Pickup" &&
          location.isTakeoutOrderingDisable === true
        ) {
          return (
            <h5 className="size_22 color_red weight_300 margin_bottom_20" style={{textAlign:"center"}}>
              {" "}
              {location.orderingMessage && location.orderingMessage}{" "}
            </h5>
          );
        } else if (
          deliveryaddressinfo &&
          deliveryaddressinfo.pickupordelivery === "Delivery" &&
          location.isDeliveryOrderingDisable === true
        ) {
          return (
            <h5 className="size_22 color_red weight_300 margin_bottom_20" style={{textAlign:"center"}}>
              {" "}
              {location.orderingMessage && location.orderingMessage}{" "}
            </h5>
          );
        } else {
          if(buttonname==="Add to cart"){
          return <a className="blue_btn size_22" onClick={()=>buttonclick()}>{buttonname}</a>
          }else{
              return <a className="blue_btn size_22" onClick={()=>buttonclick()}>{buttonname}</a>
          }
        }
      }
}
