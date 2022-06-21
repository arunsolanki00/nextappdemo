import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LocationServices } from "../../redux/location/location.services";
const LocationListComponent = (props) => {
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    LocationServices.getAllLocationList(props.restaurantId).then((response) => {
      if (response) {
        console.log(response);
        setLocationList(response.locations);
      }
    });
  }, []);

  const locationArrayList = [];
  for (let i = 0; i < locationList.length; i += 2) {
    const evenItem = locationList[i];
    const oddItem = locationList[i + 1];

    locationArrayList.push(
      <div className="row row-eq-height">
        {oddItem ? (
          <div className="col-lg-6 s-piza addressGrid b-right b-bottom col-sm-12 col-xs-12">
          <div  style={{marginLeft:"15px"}}>
            <h5 className="size_22 color_black weight_300" >
              <img src="/images/pin.png" alt className="margin_right_10" />{" "}
              {oddItem?.locationName}
            </h5>
            <h5 className="margin_left_25 address">
              <span className="size_20 margin_left_20 margin_top_15 color_grey">
                {oddItem?.address1} 
                <br />
                {oddItem?.cityname}
                <br />
                {oddItem?.statename}{" , "}{oddItem?.countryName}{" , "}{oddItem?.zipcode}
              </span>
            </h5> 
            <h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
              <i className="fa fa-phone" />{" "}
              <span className="size_20 color_grey">{oddItem?.phone}</span>
            </h5>
            </div>
          </div>
        ) : (
            ""
          )}
        {evenItem ? (
          <div className={`col-lg-6 s-piza addressGrid b-bottom col-sm-12 col-xs-12 ${(locationList.length - i === 1 ) && `b-right  `}`} >
            <div style={{marginLeft:"15px"}}>
            <h5 className="size_22 color_black weight_300">
              <img src="/images/pin.png" alt className="margin_right_10" />{" "}
              {evenItem?.locationName}
            </h5>
            <h5 className="margin_left_25 address">
              <span className="size_20 margin_left_20 margin_top_15 color_grey">
                {evenItem?.address1}
                <br />
                {evenItem?.cityname}
                <br />
                {evenItem?.statename}{" , "}{evenItem?.countryName}{" , "}{evenItem?.zipcode}
              </span>
            </h5>
            <h5 className="size_22 color_black weight_300 margin_top_20 margin_bottom_20">
              <i className="fa fa-phone" />{" "}
              <span className="size_20 color_grey">{evenItem?.phone && evenItem?.phone}</span>
            </h5>
            </div>
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }

  return locationList != undefined &&
    locationList &&
    locationList.length > 0 ? (
      <>{locationArrayList}</>
    ) : (
      ""
    );
};

export default LocationListComponent;
