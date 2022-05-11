import React, { useEffect, useState } from "react";
import { RestaurantHoursServices } from "../../redux/restaurant-hour/restaurant-hour.services";

const RestaurantTodayTime = (props) => {

  const { pickupTime, deliverTime, locationId, restaurantId } = props;
  //   const {locationId, restaurantId } = props;


  const [data, dataSet] = useState([]);
  //   const pickupTime = [];
  //   const deliverTime = [];

  useEffect(() => {
    function fetchMyAPI() {
      const response = RestaurantHoursServices.getRestaurantTodayTimming(
        restaurantId,
        locationId
      );
      //   pickupTime =response.pickupTime;
      //   deliverTime =response.deliverTime;

      dataSet(response);
    }
    fetchMyAPI();
  }, [locationId]);

  return (
    <>
      <div className="col-lg-4 col-sm-4 col-xs-12">
        <h5 className="size_22 color_black weight_300 margin_bottom_20">
          <i className="fa fa-clock-o" />
          Pickup hours
          <br />
          {pickupTime &&
            pickupTime.map((ptime, index) => (
              <span className="size_20 color_grey" id={index}>
                {ptime}
                <br />
              </span>
            ))}
        </h5>
      </div>

      <div className="col-lg-4 col-sm-4 col-xs-12">
        <h5 className="size_22 color_black weight_300 margin_bottom_20">
          <i className="fa fa-clock-o" />
          Delivery hours
          <br />
          {deliverTime &&
            deliverTime.map((dtime, index) => (
              <span className="size_20 color_grey" id={index}>
                {dtime}
                <br />
              </span>
            ))}
        </h5>
      </div>
    </>
  );
};

export default RestaurantTodayTime;
