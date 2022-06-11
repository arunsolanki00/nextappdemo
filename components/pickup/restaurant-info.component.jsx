import React, { useState, useEffect } from "react";
import Image from "next/image";
import RestaurantLocationsComponent from "../Common/restaurant-locations.component";
import RestaurantTimmingComponent from "../Common/restaurant-timming.component";

const RestaurantInfoComponent = (props) => {
  const locations = props.restaurantinfo.defaultLocation;
  const deliverTime = props.timminginfo.deliveryTime;
  const pickupTime = props.timminginfo.pickupTime;
  const [locationpopup, setlocationpopup] = useState(false);
  const [restaurantHoursPopup, setrestaurantHoursPopup] = useState(false);
  const handleLocationPopup = () => setlocationpopup(true);
  const handlerestaurantHoursPopup = () => setrestaurantHoursPopup(true);
  return (
    <>
      <div className="row in">
        <div className="col-lg-12 flush col-sm-12 col-xs-12">
          <div className="col-lg-12 col-sm-12 col-xs-12">
            <h4 className="size_24 color_orange weight_500 margin_top_0 margin_bottom_15">
              Restaurant info 
            </h4>
          </div>
          <div className="col-lg-8 col-sm-8 col-xs-12">
            <h5 className="size_22 color_black weight_300 margin_bottom_20">
              <img src="/images/pin.png" alt="" />
              {locations.locationName} 
              <br />
              <span className="size_20 color_grey">
                {`${locations.address1},  ${locations.cityname}`}
              </span>
            </h5>
            <h5 className="size_22 color_black weight_300 margin_bottom_20">
              <i className="fa fa-phone" />
              <span className="size_20 color_grey">{locations.phone}</span>
            </h5>
          </div>
          <div className="col-lg-4 text-center col-sm-6 col-xs-12">
            <a
              className="light_orange_btn clock_more_btn"
              onClick={handleLocationPopup}
              data-toggle="modal"
              data-target="#myModal"
            >
              <i className="fa fa-map-marker" /> More
            </a>
            <p className="size_12 margin_top_10">Changing location may affect your <br />added items in cart.</p>
          </div>
        </div>
        <div className="col-lg-4 col-sm-4 col-xs-12">
          <h5 className="size_22 color_black weight_300 margin_bottom_20">
            {pickupTime &&
              pickupTime.map((ptime, index) => (
                <span className="size_20 color_grey" id={index} key={index}>
                  {ptime}
                  <br />
                </span>
              ))}
          </h5>
        </div>
        <div className="col-lg-4 col-sm-4 col-xs-12">
          <h5 className="size_22 color_black weight_300 margin_bottom_20">
            {deliverTime &&
              deliverTime.map((dtime, index) => (
                <span className="size_20 color_grey" id={index} key={index}>
                  {dtime}
                  <br />
                </span>
              ))}
          </h5>
        </div>
        <div className="col-lg-4 text-center col-sm-4 col-xs-12">
          <a
            className="light_orange_btn clock_more_btn"
            onClick={handlerestaurantHoursPopup}
            data-toggle="modal"
            data-target="#myModal-2"
          >
            <i className="fa fa-clock-o" /> More
          </a>
          <p className="size_12 margin_top_10">Changing time may affect your<br />added items in cart.</p>
        </div>
      </div>
      {locationpopup === true && (
        <RestaurantLocationsComponent restaurantId={locations.restaurantId} />
      )}
      {restaurantHoursPopup === true && (
        <RestaurantTimmingComponent
          locationId={locations.locationId}
          restaurantId={locations.restaurantId}
        />
      )}
    </>
  );
};

export default RestaurantInfoComponent;
