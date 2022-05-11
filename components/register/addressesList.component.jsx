import React from "react";
import Image from "next/image";
import { DeliveryAddressTypes } from "../../redux/delivery-address/delivery-address.types";
import { DeliveryAddressServices } from "../../redux/delivery-address/delivery-address.services";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { registerAddress } from "../../redux/delivery-address/delivery-address.action";

const AddressesListComponent = ({ registerAddressdata }) => {

  let restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);

  const dispatch = useDispatch();

  const handledeleteAddressPopup = () => {
    dispatch(registerAddress({}));
  }

  if (registerAddressdata && registerAddressdata.address1 != undefined && registerAddressdata.address1)
    return (
      <>
        <div className="col-lg-6 col-sm-12 col-xs-12">
          <div className="col-lg-12 flush border_radius_20 col-sm-12 col-xs-12">
            <h4 className="size_24 color_orange weight_500 margin_bottom_15">
              {registerAddressdata.addresstype === 0 ? "Personal Address" : "Business Address"}
            </h4>
          </div>

          {registerAddressdata != undefined &&
            registerAddressdata != null &&
            <div
              className="col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12"
            >
              <h5 className="size_22  color_black weight_300 margin_bottom_20">
                <em className="position_none float_right">
                  <a data-toggle="modal" data-target="#myModal-delete-address" onClick={() => handledeleteAddressPopup(registerAddressdata.deliveryaddressId)} >
                    <img
                      style={{ maxHeight: 20 }}
                      src="/images/bin-1.svg"
                      alt
                    />
                  </a>
                </em>
                <img src="/images/pin.png" alt="" />
                {registerAddressdata.address1} ,
                <br />
                <span className="size_20 margin_top_15 color_grey">
                  {registerAddressdata.address2 && registerAddressdata.address2.trim().length > 1 ? (
                    <>
                      {registerAddressdata.address2} , <br />
                    </>
                  ) : ("")}
                  {registerAddressdata.landmark ? (
                    <>
                      {registerAddressdata.landmark} ,<br />
                    </>
                  ) : ("")}
                  {registerAddressdata.city ? (
                    <>
                      {registerAddressdata.city} ,<br />
                    </>
                  ) : ("")}
                  {registerAddressdata.zipcode ? (
                    <>
                      {registerAddressdata.zipcode}
                    </>
                  ) : ("")}
                </span>
              </h5>
            </div>
          }
        </div>
      </>
    );
  return null
};

export default AddressesListComponent;
