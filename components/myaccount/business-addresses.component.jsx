import { React, useState, useEffect } from "react";
import Image from "next/image";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { DeliveryAddressServices } from "../../redux/delivery-address/delivery-address.services";
import { DeliveryAddressTypes } from "../../redux/delivery-address/delivery-address.types";
import { getAddress } from "../../redux/delivery-address/delivery-address.action";
import { element } from "prop-types";

const BusinessAddressesComponent = (props) => {
  const [businessaddress, setbusinessaddress] = useState();
  // const businessaddress = props.businessAddressList;
  const reloadAddressList = props.reloadAddressList;
  const restaurantId = props.restaurantinfo.restaurantId;
  const locationId = props.restaurantinfo.defaultlocationId;
  const customerId = props.userinfo.customerId;

  const dispatch = useDispatch();
  useEffect(() => {
    setbusinessaddress(props.businessAddressList);
  }, [props.businessAddressList]);

  const [updatestate, setupdatestate] = useState(null);

  const handledeleteAddressPopup = (addressId, index) => {
    if (addressId != undefined) {
      DeliveryAddressServices.deleteDeliveryAddress(
        addressId,
        restaurantId
      ).then((response) => {
        if (response) {
          dispatch({
            type: DeliveryAddressTypes.DELETE_ADDRESS,
            payload: response,
          });
          if (props.businessAddressList.length > 0) {
            let newlist = props.businessAddressList.filter(
              (element) => element?.deliveryaddressId === addressId
            );
            props.businessAddressList.splice(newlist);
          }
          props.reloadAddressList();
        }
      });
    }
  };
  return (
    <>
      <div className="col-lg-6 col-sm-12 col-xs-12 flush-right">
        <div className="col-lg-12 flush border_radius_20 col-sm-12 col-xs-12">
          <h4 className="size_24 color_orange weight_500 margin_bottom_15">
            Business Address
          </h4>
        </div>
        {businessaddress != undefined &&
          businessaddress.length > 0 &&
          businessaddress.map((data, index) => (
            <div
              className="col-lg-12 margin_top_20 full_grey_border padding_10 border_radius_20 col-sm-12 col-xs-12"
              key={index}
            >
              <h5 className="size_22  color_black weight_300 margin_bottom_20">
                <em className="position_none float_right">
                  <a
                    data-toggle="modal"
                    data-target="#myModal-delete-address"
                    onClick={() =>
                      handledeleteAddressPopup(data.deliveryaddressId, index)
                    }
                  >
                    <img
                      style={{ maxHeight: 20 }}
                      src="/images/bin-1.svg"
                      alt
                    />
                  </a>
                </em>
                <img src="/images/pin.png" alt="" />
                <>
                  {data.businessname && data.businessname
                    ? data.businessname
                    : data.address1}{" "}
                  ,
                  <br />
                </>
                <span className="size_20 margin_top_15 color_grey">
                  {data.address1 &&
                  data.businessname.trim() !== "" &&
                  data.address1.trim().length > 1 ? (
                    <>
                      {data.address1} , <br />
                    </>
                  ) : (
                    ""
                  )}

                  {data.address2 && data.address2.trim().length > 1 ? (
                    <>
                      {data.address2} , <br />
                    </>
                  ) : (
                    ""
                  )}
                  {data.landmark ? (
                    <>
                      {data.landmark} ,<br />
                    </>
                  ) : (
                    ""
                  )}
                  {data.city ? (
                    <>
                      {data.city} , <br />
                    </>
                  ) : (
                    ""
                  )}
                  {data.zipcode ? <>{data.zipcode} </> : ""}
                </span>
              </h5>
            </div>
          ))}
      </div>
    </>
  );
};

export default BusinessAddressesComponent;
